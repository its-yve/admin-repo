import tkinter as tk
import customtkinter as ctk
from PIL import Image, ImageTk
import os

# =========================
# Credentials
# =========================
VALID_USERNAME = "sysadmin"
VALID_PASSWORD = "P@ssw0rd"

# =========================
# App Setup
# =========================
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("dark-blue")

app = tk.Tk()
app.geometry("1100x650")
app.title("Admin Login")
app.resizable(False, False)

script_dir = os.path.dirname(os.path.abspath(__file__))

# =========================
# Background
# =========================
bg_path = os.path.join(script_dir, "bg.png")
bg_img = Image.open(bg_path).resize((1100, 650), Image.Resampling.LANCZOS)
bg_photo = ImageTk.PhotoImage(bg_img)

canvas = tk.Canvas(app, width=1100, height=650, highlightthickness=0)
canvas.place(x=0, y=0)
canvas.create_image(0, 0, anchor="nw", image=bg_photo)

# =========================
# Robot Image
# =========================
robot_path = os.path.join(script_dir, "robot.png")
robot_img = Image.open(robot_path)
robot_img.thumbnail((400, 600), Image.Resampling.LANCZOS)
robot_photo = ImageTk.PhotoImage(robot_img)
canvas.create_image(250, 400, image=robot_photo)

# =========================
# Title & Subtitle
# =========================
canvas.create_text(830, 150, text="Welcome back!", font=("Arial", 34, "bold"), fill="white")
canvas.create_text(830, 200, text="Authorized admins only", font=("Arial", 14), fill="#aaaaaa")

# =========================
# Container Frame for Entry + Eye Button
# =========================
def create_password_entry(parent, x, y, width, height):
    frame = ctk.CTkFrame(parent, width=width, height=height, fg_color="#1f1f1f", corner_radius=25, border_width=0)
    frame.place(x=x, y=y)

    entry = ctk.CTkEntry(
        frame,
        placeholder_text="Password",
        width=width-50,
        height=height,
        show="*",
        fg_color="#1f1f1f",
        border_width=0,
        text_color="white",
        font=ctk.CTkFont(size=14)
    )
    entry.place(x=0, y=0)

    # Eye toggle
    show_password = [False]  # use mutable list to modify inside nested function

    def toggle():
        show_password[0] = not show_password[0]
        entry.configure(show="" if show_password[0] else "*")
        eye_btn.configure(text="🙈" if show_password[0] else "👁")

    eye_btn = ctk.CTkButton(
        frame,
        text="👁",
        width=40,
        height=height-10,
        fg_color="#1f1f1f",
        corner_radius=20,
        border_width=0,
        command=toggle
    )
    eye_btn.place(x=width-45, y=5)

    return entry

# =========================
# Username Entry (edge-free)
# =========================
username_entry = ctk.CTkEntry(
    app,
    placeholder_text="Username",
    width=440,
    height=45,
    corner_radius=25,
    font=ctk.CTkFont(size=14),
    fg_color="#1f1f1f",
    border_width=0,
    text_color="white"
)
username_entry.place(x=630, y=260)
username_entry.focus()

# =========================
# Password Entry
# =========================
password_entry = create_password_entry(app, 630, 320, 440, 45)

# =========================
# Edge-free Buttons
# =========================
def login():
    username = username_entry.get()
    password = password_entry.get()
    if username == VALID_USERNAME and password == VALID_PASSWORD:
        ctk.CTkMessagebox.show_info("Success", "Login successful!")
    else:
        ctk.CTkMessagebox.show_error("Error", "Invalid username or password.")

def signup():
    ctk.CTkMessagebox.show_info("Sign Up", "Redirecting to Sign Up page...")

login_btn = ctk.CTkButton(
    app,
    text="Login",
    width=200,
    height=45,
    corner_radius=25,
    fg_color="#f5d3d3",
    text_color="black",
    border_width=0,
    font=ctk.CTkFont(size=16, weight="bold"),
    command=login
)
login_btn.place(x=680, y=400)

signup_btn = ctk.CTkButton(
    app,
    text="Sign Up",
    width=200,
    height=45,
    corner_radius=25,
    fg_color="#444444",
    text_color="white",
    border_width=0,
    font=ctk.CTkFont(size=16, weight="bold"),
    command=signup
)
signup_btn.place(x=680, y=460)

# =========================
# Trigger login with Enter key
# =========================
app.bind("<Return>", lambda event: login())

app.mainloop()