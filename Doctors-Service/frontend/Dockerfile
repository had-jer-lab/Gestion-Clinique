FROM node:18-alpine

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت المكتبات
RUN npm install

# نسخ باقي الملفات
COPY . .

# إنشاء ملف .env للبيئة
RUN echo "VITE_API_URL=http://doctors-service:5000/api" > .env && \
    echo "VITE_PATIENTS_URL=http://patients-backend:5001" >> .env && \
    echo "VITE_RDV_URL=http://rdv-backend:5005" >> .env && \
    echo "VITE_AUTH_URL=http://auth-service:5009" >> .env

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]