const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 5000;

const app = express();

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.resolve(__dirname, "../client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		res.json({ message: "Hello from server!" });
	});
}

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
