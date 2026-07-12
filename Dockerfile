FROM node:20-slim

WORKDIR /app

COPY Backend/package.json Backend/package-lock.json* Backend/
RUN cd Backend && npm install

COPY Frontend/package.json Frontend/package-lock.json* Frontend/
RUN cd Frontend && npm install

COPY Backend/ Backend/
COPY Frontend/ Frontend/

RUN cd Frontend && npm run build
RUN cd Backend && npx prisma generate

EXPOSE 5001

CMD ["sh", "-c", "cd Backend && npx prisma migrate deploy && NODE_ENV=production node src/server.js"]
