import os
from PIL import Image, ImageDraw, ImageFont

def generate_review_screenshot():
    # Width and height for an elegant Facebook review card
    W, H = 840, 500
    
    # Create white canvas
    img = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Soft subtle border around the screenshot
    draw.rounded_rectangle([0, 0, W-1, H-1], radius=24, outline=(220, 222, 235), width=2)
    
    # Top header bar (Facebook style)
    avatar_size = 64
    ax, ay = 36, 36
    
    # Avatar circle with gradient or purple
    draw.ellipse([ax, ay, ax + avatar_size, ay + avatar_size], fill=(136, 126, 216))
    
    # Load fonts
    try:
        font_name = ImageFont.truetype("arialbd.ttf", 22)
        font_meta = ImageFont.truetype("arial.ttf", 15)
        font_body = ImageFont.truetype("arial.ttf", 21)
        font_stars = ImageFont.truetype("segoeui.ttf", 24)
        font_reactions = ImageFont.truetype("arial.ttf", 16)
        font_avatar = ImageFont.truetype("arialbd.ttf", 30)
    except:
        font_name = ImageFont.load_default()
        font_meta = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_stars = ImageFont.load_default()
        font_reactions = ImageFont.load_default()
        font_avatar = ImageFont.load_default()

    # Avatar letter "Н"
    draw.text((ax + 20, ay + 14), "Н", font=font_avatar, fill=(255, 255, 255))

    # Name and Meta
    draw.text((ax + avatar_size + 18, ay + 6), "Нели Иванова", font=font_name, fill=(24, 25, 38))
    draw.text((ax + avatar_size + 18, ay + 36), "12 март · Препоръчва Образователен клуб „УМеНИе“ · 🌐", font=font_meta, fill=(110, 114, 130))

    # 5 Gold Stars
    stars_y = ay + avatar_size + 24
    draw.text((36, stars_y), "⭐⭐⭐⭐⭐", font=font_stars, fill=(251, 197, 49))

    # Review text lines
    text_y = stars_y + 44
    lines = [
        "„Искам да благодаря от сърце на прекрасния екип на клуб УМеНИе!",
        "Дъщеря ми посещава учебната занималня и уроците по английски.",
        "Прибира се усмихната, уверена и с научени уроци. Индивидуалният",
        "подход и грижата на преподавателите правят истински чудеса.",
        "Препоръчвам горещо на всички родители в Бургас!“"
    ]

    for line in lines:
        draw.text((36, text_y), line, font=font_body, fill=(35, 37, 50))
        text_y += 34

    # Divider line
    div_y = H - 75
    draw.line([(36, div_y), (W - 36, div_y)], fill=(235, 236, 244), width=1)

    # Reactions bar at bottom
    # Like & Love reaction circles
    draw.ellipse([36, div_y + 16, 68, div_y + 48], fill=(66, 103, 178))
    draw.text((44, div_y + 20), "👍", font=font_reactions, fill=(255, 255, 255))
    draw.ellipse([64, div_y + 16, 96, div_y + 48], fill=(242, 60, 85))
    draw.text((72, div_y + 20), "❤️", font=font_reactions, fill=(255, 255, 255))

    draw.text((106, div_y + 22), "52 харесвания", font=font_reactions, fill=(100, 102, 120))
    draw.text((W - 190, div_y + 22), "14 коментара", font=font_reactions, fill=(100, 102, 120))

    out_path = "public/images/review-screenshot.webp"
    img.save(out_path, "WEBP", quality=92)
    print(f"Created {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    generate_review_screenshot()
