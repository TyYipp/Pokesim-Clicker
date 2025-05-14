const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); // Corrected path

describe("Pokémon Routes", () => {
  let server;
  let pokemonId;

  beforeAll(async () => {
    // Start the server before running tests
    server = app.listen(3001, () => console.log('Test server started on port 3001.'));
  });

  afterAll(async () => {
    // Ensure the server and any open connections are properly closed
    await mongoose.connection.close();
    server.close(() => {
      console.log('Test server closed.');
    });
  });

  it("should get all Pokémon (paginated)", async () => {
    const res = await request(app).get("/pokemon?p=1");
    expect(res.status).toBe(200);
    expect(res.body.pokemon).toBeInstanceOf(Array);
  });

  it("should add a new Pokémon", async () => {
    const res = await request(app)
      .post("/pokemon")
      .send({
        name: "Pikachu",
        multiplier: 1.2,
        image: "http://example.com/pikachu.jpg"
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Pikachu");
    pokemonId = res.body._id; // Store Pokémon ID for deletion test
  });

  it("should get a Pokémon by ID", async () => {
    const res = await request(app).get(`/pokemon/${pokemonId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Pikachu");
  });

  it("should delete a Pokémon by ID", async () => {
    const res = await request(app).delete(`/pokemon/${pokemonId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pokémon deleted successfully");
  });
});
