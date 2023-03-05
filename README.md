# How to Build the First containerized java web application

## Prerequisite

- JDK 17 or above
- Spring Tool Suite for Eclipse
- Docker Desktop



## Getting Started


## Step 1. Clone the repository

```
git clone https://github.com/dockersamples/genie-website-java
```

## Step 2. Building the JAR file

Use the Spring Tool Suite to build the JAR file

![image](https://user-images.githubusercontent.com/313480/183990655-46329371-6c27-484f-a66b-fdfcd7efbb0a.png)

![image](https://user-images.githubusercontent.com/313480/183990719-41814631-0ca2-4178-889d-6cddf4875c83.png)



## Step 3. Building docker image

I assume that you have already followed step 2 to build ```webapp-0.0.1-SNAPSHOT.jar``` file under the target directory.


```
docker build -t docker_desktop_page .
```

## Step 4. Running the docker container
```
docker run -p 8080:8080 docker_desktop_page
```

<img width="1451" alt="Screenshot 2022-08-10 at 11 41 18 PM" src="https://user-images.githubusercontent.com/111007084/183986105-d4655cb8-1954-4625-b568-9d76f063b5e5.png">
