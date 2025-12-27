FROM python:3.10-slim

WORKDIR /app

# تثبيت المكتبات الأساسية
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# نسخ وتثبيت المتطلبات
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ ملفات المشروع
COPY . .

# فتح المنفذ الصحيح
EXPOSE 5005

# الانتظار حتى يصبح قاعدة البيانات جاهزة ثم تشغيل التطبيق
CMD ["python", "app.py"]