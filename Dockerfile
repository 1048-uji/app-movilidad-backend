# Usa una imagen de Node.js como base
FROM node:18

# Establece el directorio de trabajo en 
WORKDIR /src/main

# Copia el archivo package.json e package-lock.json a la raíz de la aplicación
RUN npm install -g @nestjs/cli
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación al directorio de trabajo
COPY . .

# Expón el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Define el comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]