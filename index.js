const http = require("http");
const port = 3000;

const userArr = [
    { id: 1, name: "Alikhan" },
    { id: 2, name: "Nurislam" }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    res.setHeader('Content-Type', 'application/json');

    // GET ALL USERS
    if (method === "GET" && url === "/users") {
        res.writeHead(200);
        res.end(JSON.stringify(userArr));
    }

    // GET ONE USER
    else if (url.startsWith("/users/") && method === "GET") {
        const id = parseInt(url.split("/")[2]);
        const findUser = userArr.find((user) => user.id === id);

        if (!findUser) {
            res.writeHead(404);
            return res.end(JSON.stringify({ message: "User not found" }));
        }

        res.writeHead(200);
        res.end(JSON.stringify(findUser));
    }

    // CREATE USER
    else if (method === "POST" && url === "/users/") {
        let body = '';
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            const newUser = JSON.parse(body);
            newUser.id = userArr.length ? userArr[userArr.length - 1].id + 1 : 1;
            userArr.push(newUser);

            res.writeHead(201);
            res.end(JSON.stringify(newUser));
        });
    }

    // UPDATE USER (PUT)
    else if (method === "PUT" && url.startsWith("/users/")) {
        const id = parseInt(url.split("/")[2]);
        const index = userArr.findIndex((user) => user.id === id);

        if (index === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ message: "User not found" }));
        }

        let body = '';
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            const updatedData = JSON.parse(body);
            userArr[index] = { ...userArr[index], ...updatedData };

            res.writeHead(200);
            res.end(JSON.stringify(userArr[index]));
        });
    }

    // DELETE USER
    else if (url.startsWith("/users/") && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        const index = userArr.findIndex((user) => user.id === id);

        if (index === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ message: "User not found" }));
        }

        const deletedUser = userArr.splice(index, 1)[0];

        res.writeHead(200);
        res.end(JSON.stringify({
            message: "User deleted successfully",
            deletedUser
        }));
    }

    // Not Found
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});