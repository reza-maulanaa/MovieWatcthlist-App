import { prisma } from "../config/db.js";

const getMovies = async (req, res) => {
  const { search, genre, year, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { overview: { contains: search, mode: "insensitive" } },
    ];
  }

  if (genre) {
    where.genres = { has: genre };
  }

  if (year) {
    where.releaseYear = Number(year);
  }

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.movie.count({ where }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

const getMovieById = async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
    include: {
      creator: { select: { id: true, name: true } },
      watchListItems: {
        select: { id: true, status: true, rating: true, notes: true, userId: true },
      },
    },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.status(200).json({
    status: "success",
    data: { movie },
  });
};

const createMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

  const movie = await prisma.movie.create({
    data: {
      title,
      overview,
      releaseYear: Number(releaseYear),
      genres: genres || [],
      runtime: runtime ? Number(runtime) : null,
      posterUrl: posterUrl || null,
      createdBy: req.user.id,
    },
    include: {
      creator: { select: { id: true, name: true } },
    },
  });

  res.status(201).json({
    status: "success",
    data: { movie },
  });
};

const updateMovie = async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({ error: "Not allowed to update this movie" });
  }

  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (overview !== undefined) updateData.overview = overview;
  if (releaseYear !== undefined) updateData.releaseYear = Number(releaseYear);
  if (genres !== undefined) updateData.genres = genres;
  if (runtime !== undefined) updateData.runtime = runtime ? Number(runtime) : null;
  if (posterUrl !== undefined) updateData.posterUrl = posterUrl;

  const updated = await prisma.movie.update({
    where: { id: req.params.id },
    data: updateData,
    include: {
      creator: { select: { id: true, name: true } },
    },
  });

  res.status(200).json({
    status: "success",
    data: { movie: updated },
  });
};

const deleteMovie = async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({ error: "Not allowed to delete this movie" });
  }

  await prisma.movie.delete({ where: { id: req.params.id } });

  res.status(200).json({
    status: "success",
    message: "Movie deleted successfully",
  });
};

const getGenres = async (req, res) => {
  const movies = await prisma.movie.findMany({
    select: { genres: true },
  });

  const genreSet = new Set();
  movies.forEach((m) => m.genres.forEach((g) => genreSet.add(g)));

  res.status(200).json({
    status: "success",
    data: { genres: [...genreSet].sort() },
  });
};

export { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, getGenres };
