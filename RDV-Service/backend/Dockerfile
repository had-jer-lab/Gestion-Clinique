FROM python:3.10-slim

WORKDIR /app

# تثبيت المكتبات الأساسية
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# نسخ وتثبيت المتطلبات
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ ملفات المشروع
COPY . .

# فتح المنفذ
EXPOSE 5000

# الانتظار حتى يصبح قاعدة البيانات جاهزة ثم تشغيل التطبيق
CMD ["python", "app.py"]