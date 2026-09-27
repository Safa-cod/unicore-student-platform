# =====================================================================
# weather.py — Open-Meteo integration for Unicore
# =====================================================================
# Two public functions:
#   geocode_city(city)   -> resolves a city name to lat/lon/country/tz
#   get_weather(city)    -> full payload shaped exactly like the
#                            `sampleWeather` objects in app.js, so
#                            renderWeather() on the frontend needs no
#                            changes at all.
#
# Open-Meteo is free and needs no API key:
#   Geocoding: https://open-meteo.com/en/docs/geocoding-api
#   Forecast:  https://open-meteo.com/en/docs/
# =====================================================================

import requests
from datetime import datetime

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

# WMO weather codes -> (human-readable condition, icon key used by app.js)
# app.js only knows 4 icon keys: clear, clouds, rain, storm.
WEATHER_CODES = {
    0: ("Clear sky", "clear"),
    1: ("Mainly clear", "clear"),
    2: ("Partly cloudy", "clouds"),
    3: ("Overcast", "clouds"),
    45: ("Fog", "clouds"),
    48: ("Depositing rime fog", "clouds"),
    51: ("Light drizzle", "rain"),
    53: ("Drizzle", "rain"),
    55: ("Dense drizzle", "rain"),
    56: ("Freezing drizzle", "rain"),
    57: ("Freezing drizzle", "rain"),
    61: ("Slight rain", "rain"),
    63: ("Rain", "rain"),
    65: ("Heavy rain", "rain"),
    66: ("Freezing rain", "rain"),
    67: ("Freezing rain", "rain"),
    71: ("Slight snow", "clouds"),
    73: ("Snow", "clouds"),
    75: ("Heavy snow", "clouds"),
    77: ("Snow grains", "clouds"),
    80: ("Rain showers", "rain"),
    81: ("Rain showers", "rain"),
    82: ("Violent rain showers", "rain"),
    85: ("Snow showers", "clouds"),
    86: ("Heavy snow showers", "clouds"),
    95: ("Thunderstorm", "storm"),
    96: ("Thunderstorm with hail", "storm"),
    99: ("Thunderstorm with hail", "storm"),
}


def describe(code):
    return WEATHER_CODES.get(code, ("Clear sky", "clear"))


def geocode_city(city):
    """Return the best matching city {name, country, latitude, longitude, timezone}."""
    query = (city or "").strip()
    if not query:
        return None

    # Ask for several candidates instead of blindly taking result #1.
    # Prefer an exact city-name match; this prevents ambiguous names from
    # silently resolving to a different place.
    resp = requests.get(
        GEOCODE_URL,
        params={"name": query, "count": 10, "language": "en", "format": "json"},
        timeout=10,
    )
    resp.raise_for_status()
    results = resp.json().get("results") or []
    if not results:
        return None

    q = query.casefold()
    exact = [r for r in results if str(r.get("name", "")).casefold() == q]
    r = exact[0] if exact else results[0]

    return {
        "name": r["name"],
        "country": r.get("country", ""),
        "latitude": r["latitude"],
        "longitude": r["longitude"],
        "timezone": r.get("timezone") or "auto",
    }


def _fmt_clock(iso_str):
    """'2026-09-26T05:44' -> '5:44 AM'"""
    dt = datetime.fromisoformat(iso_str)
    # %-I (no leading zero) is a Linux/Mac-only strftime extension and
    # raises "Invalid format string" on Windows. Use the portable %I
    # and strip a leading zero manually so this works everywhere.
    return dt.strftime("%I:%M %p").lstrip("0")


def _fmt_hour_label(iso_str, is_now=False):
    if is_now:
        return "Now"
    dt = datetime.fromisoformat(iso_str)
    return dt.strftime("%I %p").lstrip("0")


def _fmt_day_label(iso_str, index):
    if index == 0:
        return "Today"
    dt = datetime.fromisoformat(iso_str)
    return dt.strftime("%a")


def get_weather(city):
    """Full payload for GET /api/weather?city=<city>.

    Returns None if the city can't be geocoded, otherwise a dict shaped
    like the sampleWeather entries in app.js:
      { city, country, tempC, tempF, feelsC, feelsF, condition,
        conditionIcon, humidity, wind, pressure, sunrise, sunset,
        hours: [...], days: [...] }
    """
    place = geocode_city(city)
    if place is None:
        return None

    resp = requests.get(
        FORECAST_URL,
        params={
            "latitude": place["latitude"],
            "longitude": place["longitude"],
            "timezone": place["timezone"],
            "current": ",".join([
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "weather_code",
                "surface_pressure",
                "wind_speed_10m",
            ]),
            "hourly": ",".join([
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation_probability",
                "weather_code",
                "surface_pressure",
                "wind_speed_10m",
            ]),
            "daily": ",".join([
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "sunrise",
                "sunset",
            ]),
        },
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    hourly = data["hourly"]
    current = data["current"]
    daily = data["daily"]

    # Current conditions come directly from Open-Meteo's current block.
    # Current data can be 15-minutely while hourly data is on the hour, so
    # use the latest hourly slot at or before the current timestamp.
    current_dt = datetime.fromisoformat(current["time"])
    now_index = 0
    for i, value in enumerate(hourly["time"]):
        if datetime.fromisoformat(value) <= current_dt:
            now_index = i
        else:
            break

    temp_c = round(current["temperature_2m"])
    temp_f = round(temp_c * 9 / 5 + 32)
    feels_c = round(current["apparent_temperature"])
    feels_f = round(feels_c * 9 / 5 + 32)
    condition, condition_icon = describe(current["weather_code"])

    hours = []
    for i in range(now_index, min(now_index + 8, len(hourly["time"]))):
        c, icon = describe(hourly["weather_code"][i])
        hours.append({
            "t": _fmt_hour_label(hourly["time"][i], is_now=(i == now_index)),
            "icon": icon,
            "temp": f'{round(hourly["temperature_2m"][i])}°',
            "rain": f'{hourly["precipitation_probability"][i] or 0}%',
        })

    days = []
    for i in range(min(5, len(daily["time"]))):
        c, icon = describe(daily["weather_code"][i])
        days.append({
            "d": _fmt_day_label(daily["time"][i], i),
            "icon": icon,
            "cond": c,
            "hi": round(daily["temperature_2m_max"][i]),
            "lo": round(daily["temperature_2m_min"][i]),
        })

    return {
        "city": place["name"],
        "country": place["country"],
        "tempC": temp_c,
        "tempF": temp_f,
        "feelsC": feels_c,
        "feelsF": feels_f,
        "condition": condition,
        "conditionIcon": condition_icon,
        "humidity": f'{round(current["relative_humidity_2m"])}%',
        "wind": f'{round(current["wind_speed_10m"])} km/h',
        "pressure": f'{round(current["surface_pressure"])} hPa',
        "sunrise": _fmt_clock(daily["sunrise"][0]),
        "sunset": _fmt_clock(daily["sunset"][0]),
        "hours": hours,
        "days": days,
    }
