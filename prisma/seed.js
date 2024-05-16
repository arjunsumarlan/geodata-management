const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Arjun Sumarlan",
        email: "emailarjun@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 1",
        email: "user.test1@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 2",
        email: "user.test2@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 3",
        email: "user.test3@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 4",
        email: "user.test4@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 5",
        email: "user.test5@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 6",
        email: "user.test6@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 7",
        email: "user.test7@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 8",
        email: "user.test8@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 9",
        email: "user.test9@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 10",
        email: "user.test10@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 11",
        email: "user.test11@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 12",
        email: "user.test12@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 13",
        email: "user.test13@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 14",
        email: "user.test14@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 15",
        email: "user.test15@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Test 16",
        email: "user.test16@gmail.com",
        password: await bcrypt.hash("testpassword", 10),
        geojson:
          '{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "AEON Mall BSD City",\n        "amenity": "Shopping Mall",\n        "description": "One of the largest shopping centers in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.664739, -6.283179]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": {\n        "name": "Green Office Park BSD",\n        "amenity": "Business Park",\n        "description": "A green and sustainable office park in BSD City."\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [106.668976, -6.299846]\n      }\n    }\n  ]\n}\n',
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
  console.log(`Users are prepopulated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
