import serial
import math
import matplotlib.pyplot as plt

# =========================
# SERIAL
# =========================
arduino = serial.Serial("COM7", 9600)

# =========================
# RADAR SETTINGS
# =========================
MAX_DISTANCE = 100
WARNING_DISTANCE = 30
#Permettre de mettre à jour au fur et à mesure des infos sans l'arrêt du programme
plt.ion()

fig, ax = plt.subplots(figsize=(8, 5))

# =========================
# DARK MODE CONFIGURATION
# =========================
fig.patch.set_facecolor("black")
ax.set_facecolor("black")

for spine in ax.spines.values():
    spine.set_color("lime")

ax.tick_params(colors="lime")

ax.set_xlim(-MAX_DISTANCE, MAX_DISTANCE)
ax.set_ylim(0, MAX_DISTANCE)
ax.set_aspect("equal")

# =========================
# DISTANCE CIRCLES
# =========================
for radius in [20, 40, 60, 80, 100]:
    circle = plt.Circle((0, 0), radius, fill=False, linewidth=1, color="lime", linestyle="--", alpha=0.4)
    ax.add_patch(circle)

    # Distance label
    ax.text(2, radius, f"{radius} cm", fontsize=8, color="lime", alpha=0.7)

# =========================
# WARNING ZONE
# =========================
warning_zone = plt.Circle((0, 0), WARNING_DISTANCE, facecolor="red", edgecolor="red", linewidth=2, linestyle="--", alpha=0.08)

ax.add_patch(warning_zone)

warning_border = plt.Circle((0, 0), WARNING_DISTANCE, fill=False, linewidth=2, color="red", linestyle="--", alpha=0.8)

ax.add_patch(warning_border)

ax.text(2, WARNING_DISTANCE, "30 cm", fontsize=9, color="red", fontweight="bold")

# =========================
# RADAR POSITION
# =========================
ax.plot(0, 0, marker="+", markersize=12, markeredgewidth=2, color="lime", label="Radar")

# =========================
# SCANNING BEAM
# =========================
#Unpacking with ","
beam_line, = ax.plot([0, 0], [0, MAX_DISTANCE], color="lime", linewidth=1.8, alpha=0.9)

beam_glow_1, = ax.plot([0, 0], [0, MAX_DISTANCE], color="lime", linewidth=5, alpha=0.12)

beam_glow_2, = ax.plot([0, 0], [0, MAX_DISTANCE], color="lime", linewidth=10, alpha=0.04)
# =========================
# SCANNED POINTS
# =========================
scan_data = {}

# =========================
# OBSTACLE POINT DISPLAY
# =========================
normal_points, = ax.plot([], [], "o", markersize=4, color="lime")
warning_points, = ax.plot([], [], "o", markersize=8, color="red")

# =========================
# INFORMATION
# =========================
title = ax.set_title("Obstacle Radar", color="lime", fontsize=11, fontweight="bold")

ax.set_xlabel("X (cm)", color="lime")
ax.set_ylabel("Y (cm)", color="lime")

# =========================
# INFORMATION PANEL
# =========================
info_text = ax.text(
    0.02,
    0.96,
    "",
    transform=ax.transAxes,
    fontsize=10,
    color="lime",
    verticalalignment="top",
    fontfamily="monospace",
    bbox=dict(
        facecolor="black",
        edgecolor="lime",
        alpha=0.75
    )
)

# =========================
# RADAR LOOP
# =========================
last_angle = None
while True:
    line = arduino.readline().decode("utf-8").strip()

    if not line:
        continue

    data = line.split(",")

    #Vérification des données reçues
    if len(data) != 3:
        continue

    try:
        angle = int(data[0])
        distance = int(data[1])
        status = data[2]

    except ValueError:
        continue

    #degrée --> radian
    theta = math.radians(angle)

    # =========================
    # NEW SCAN
    # =========================
    if angle == 0 and last_angle is not None and last_angle != 0:
        scan_data.clear()

    last_angle = angle

    # =========================
    # SAVE MEASUREMENT
    # =========================
    # Ignorer les distances > 100 cm
    if distance <= 0 or distance > MAX_DISTANCE:
        scan_data[angle] = None
    else:
        #(r,theta) --> (x,y)
        x = distance * math.cos(theta)
        y = distance * math.sin(theta)

        scan_data[angle] = (x, y, status)

    # =========================
    # UPDATE BEAM
    # =========================
    beam_x = MAX_DISTANCE * math.cos(theta)
    beam_y = MAX_DISTANCE * math.sin(theta)

    beam_line.set_data([0, beam_x], [0, beam_y])
    beam_glow_1.set_data([0, beam_x], [0, beam_y])
    beam_glow_2.set_data([0, beam_x], [0, beam_y])

    # =========================
    # UPDATE POINTS
    # =========================
    normal_x = []
    normal_y = []

    warning_x = []
    warning_y = []

    for point in scan_data.values():
        if point is None:
            continue

        x, y, point_status = point

        if point_status == "WARNING":
            warning_x.append(x)
            warning_y.append(y)
        else:
            normal_x.append(x)
            normal_y.append(y)

    normal_points.set_data(normal_x, normal_y)

    warning_points.set_data(warning_x, warning_y)

    # =========================
    # UPDATE INFORMATION
    # =========================
    title.set_text(
        f"Obstacle Radar\n"
        f"Angle: {angle}° | "
        f"Distance: {distance} cm | "
        f"Status: {status}"
    )

    info_text.set_text(
        f"RADAR STATUS\n"
        f"----------------\n"
        f"Status    : {status}\n"
        f"Angle     : {angle:3d}°\n"
        f"Distance  : {distance:3d} cm\n"
        f"Threshold : {WARNING_DISTANCE} cm"
    )

    if status == "WARNING":
        info_text.set_color("red")
        info_text.get_bbox_patch().set_edgecolor("red")
    else:
        info_text.set_color("lime")
        info_text.get_bbox_patch().set_edgecolor("lime")

    # =========================
    # REFRESH
    # =========================
    fig.canvas.draw_idle()
    fig.canvas.flush_events()