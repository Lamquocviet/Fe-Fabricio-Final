import axios from "axios";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
const REQUEST_TIMEOUT = 120000;
const DEMO_PASSWORD = "Demo@123456";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT,
});

const DEMO_USERS = [
  {
    key: "creatorOne",
    username: "seed_creator_one",
    email: "creator.one@fabricio.local",
    password: DEMO_PASSWORD,
    displayName: "Pixel Forge Studio",
    bio: "Small indie team building browser-first arcade games.",
  },
  {
    key: "creatorTwo",
    username: "seed_creator_two",
    email: "creator.two@fabricio.local",
    password: DEMO_PASSWORD,
    displayName: "Nova Playworks",
    bio: "Prototype lab for cozy, puzzle, and sci-fi game ideas.",
  },
  {
    key: "playerOne",
    username: "seed_player_one",
    email: "player.one@fabricio.local",
    password: DEMO_PASSWORD,
    displayName: "Minh Arcade",
    bio: "Plays short games, leaves practical feedback.",
  },
  {
    key: "playerTwo",
    username: "seed_player_two",
    email: "player.two@fabricio.local",
    password: DEMO_PASSWORD,
    displayName: "Lan Strategy",
    bio: "Likes turn-based systems and clean UI details.",
  },
];

const DEMO_TAGS = [
  "Racing",
  "Arcade",
  "Cyberpunk",
  "RPG",
  "Adventure",
  "Story",
  "Puzzle",
  "Cozy",
  "Simulation",
  "Horror",
  "Sci-Fi",
  "Strategy",
  "Turn-Based",
  "Fantasy",
  "Casual",
  "Indie",
];

const DEMO_GAMES = [
  {
    title: "Neon Runner",
    ownerKey: "creatorOne",
    description:
      "A fast browser runner with short stages, bright tracks, and tight restart loops.",
    gameType: "Browser",
    price: 0,
    tags: ["Arcade", "Racing", "Cyberpunk"],
    accent: "#00d4ff",
    background: "#101828",
  },
  {
    title: "Cozy Orchard",
    ownerKey: "creatorTwo",
    description:
      "A relaxing collection game about growing fruit, trading seeds, and decorating a tiny farm.",
    gameType: "Browser",
    price: 4.99,
    tags: ["Cozy", "Simulation", "Casual", "Indie"],
    accent: "#7bd88f",
    background: "#18362b",
  },
  {
    title: "Starfall Tactics",
    ownerKey: "creatorTwo",
    description:
      "A compact turn-based tactics prototype with grid combat and squad upgrades.",
    gameType: "Browser",
    price: 9.99,
    tags: ["Strategy", "Turn-Based", "Sci-Fi"],
    accent: "#f7c948",
    background: "#1c1f4a",
  },
  {
    title: "Lantern Hollow",
    ownerKey: "creatorOne",
    description:
      "A short story adventure about repairing lanterns in a quiet fantasy village.",
    gameType: "Browser",
    price: 2.99,
    tags: ["Adventure", "Story", "Fantasy", "Puzzle"],
    accent: "#ff9f43",
    background: "#2d1e2f",
  },
];

const DEMO_POSTS = [
  {
    title: "Neon Runner update notes",
    authorKey: "creatorOne",
    content:
      "We tightened jump timing, added two checkpoint layouts, and improved keyboard hints for new players.",
  },
  {
    title: "How we prototype cozy systems",
    authorKey: "creatorTwo",
    content:
      "The current build of Cozy Orchard focuses on one loop first: plant, wait, harvest, trade, decorate.",
  },
  {
    title: "Community picks for quick sessions",
    authorKey: "playerOne",
    content:
      "Neon Runner is best for a five minute break. Starfall Tactics is stronger when you want a small planning puzzle.",
  },
];

const DEMO_GAME_INTERACTIONS = [
  {
    userKey: "playerOne",
    gameTitle: "Neon Runner",
    rating: 5,
    favorite: true,
    playCount: 2,
    comment: "Very quick to understand. The restart loop feels smooth.",
  },
  {
    userKey: "playerTwo",
    gameTitle: "Neon Runner",
    rating: 4,
    favorite: true,
    playCount: 1,
    comment: "Good arcade pace. More track variety would make it stronger.",
  },
  {
    userKey: "playerOne",
    gameTitle: "Cozy Orchard",
    rating: 4,
    favorite: true,
    purchase: true,
    playCount: 1,
    comment: "Nice cozy direction. The trading loop is easy to follow.",
  },
  {
    userKey: "playerTwo",
    gameTitle: "Starfall Tactics",
    rating: 5,
    favorite: true,
    purchase: true,
    playCount: 3,
    comment: "The turn order is readable and the squad choices already feel useful.",
  },
  {
    userKey: "playerOne",
    gameTitle: "Lantern Hollow",
    rating: 4,
    purchase: true,
    comment: "The puzzle pacing fits the story tone well.",
  },
];

const DEMO_POST_INTERACTIONS = [
  {
    userKey: "playerOne",
    postTitle: "Neon Runner update notes",
    reactionType: "Like",
    comment: "The keyboard hints helped a lot on the first run.",
  },
  {
    userKey: "playerTwo",
    postTitle: "Neon Runner update notes",
    reactionType: "Like",
    comment: "Checkpoint changes make the difficulty curve feel fairer.",
  },
  {
    userKey: "creatorOne",
    postTitle: "How we prototype cozy systems",
    reactionType: "Love",
    comment: "This loop-first approach is practical for small teams.",
  },
  {
    userKey: "creatorTwo",
    postTitle: "Community picks for quick sessions",
    reactionType: "Like",
    comment: "Useful feedback. We will keep the short-session flow in mind.",
  },
];

const log = (message, data) => {
  if (data === undefined) {
    console.log(`[seed] ${message}`);
    return;
  }

  console.log(`[seed] ${message}`, data);
};

const warn = (message, data) => {
  if (data === undefined) {
    console.warn(`[seed] ${message}`);
    return;
  }

  console.warn(`[seed] ${message}`, data);
};

const normalizeKey = (value) => String(value ?? "").trim().toLowerCase();

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    "Unknown API error"
  );
};

const isConflict = (error) => error?.response?.status === 409;

const getTagName = (tag) => tag?.name || tag?.Name || "";
const getEntityId = (entity) => entity?.id || entity?.Id;
const getGameTitle = (game) => game?.title || game?.Title || "";
const getPostTitle = (post) => post?.title || post?.Title || "";
const getGamePrice = (game) => Number(game?.price ?? game?.Price ?? 0);

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.Items)) return payload.Items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.games)) return payload.games;
  if (Array.isArray(payload?.Games)) return payload.Games;
  return [];
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const slugify = (value) =>
  normalizeKey(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createFilePart = (parts, fileName, type) => {
  const options = { type };

  if (typeof File === "function") {
    return {
      value: new File(parts, fileName, options),
      fileName,
    };
  }

  return {
    value: new Blob(parts, options),
    fileName,
  };
};

const appendFile = (formData, fieldName, filePart) => {
  formData.append(fieldName, filePart.value, filePart.fileName);
};

const createThumbnail = (game) => {
  const title = escapeHtml(game.title);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="${game.background}"/>
  <rect x="56" y="56" width="848" height="428" rx="28" fill="rgba(255,255,255,0.08)" stroke="${game.accent}" stroke-width="4"/>
  <circle cx="790" cy="150" r="64" fill="${game.accent}" opacity="0.88"/>
  <path d="M110 370 C220 250 315 430 430 306 S660 250 820 354" fill="none" stroke="${game.accent}" stroke-width="18" stroke-linecap="round"/>
  <text x="96" y="166" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800">${title}</text>
  <text x="100" y="224" fill="rgba(255,255,255,0.72)" font-family="Inter, Arial, sans-serif" font-size="25">FabricIO playable demo seed</text>
</svg>`.trim();

  return createFilePart([svg], `${slugify(game.title)}-thumbnail.svg`, "image/svg+xml");
};

const createBrowserGameFiles = (game) => {
  const config = JSON.stringify({
    title: game.title,
    accent: game.accent,
    background: game.background,
  });

  return [
    {
      path: "index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(game.title)}</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="shell">
      <p class="eyebrow">FabricIO demo game</p>
      <h1>${escapeHtml(game.title)}</h1>
      <p>${escapeHtml(game.description)}</p>
      <button id="scoreButton" type="button">Score 0</button>
    </main>
    <script>window.__GAME_CONFIG__ = ${config};</script>
    <script src="./game.js"></script>
  </body>
</html>`,
    },
    {
      path: "styles.css",
      content: `:root {
  color-scheme: dark;
  font-family: Inter, Arial, sans-serif;
  background: ${game.background};
  color: white;
}

body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 80% 20%, ${game.accent}55, transparent 28rem),
    ${game.background};
}

.shell {
  width: min(720px, calc(100vw - 48px));
  padding: 48px;
  border: 1px solid ${game.accent}88;
  background: rgba(255, 255, 255, 0.08);
}

.eyebrow {
  color: ${game.accent};
  font-weight: 800;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 16px;
  font-size: clamp(48px, 8vw, 88px);
}

button {
  margin-top: 24px;
  border: 0;
  padding: 14px 22px;
  color: #101828;
  background: ${game.accent};
  font-weight: 800;
  cursor: pointer;
}`,
    },
    {
      path: "game.js",
      content: `const config = window.__GAME_CONFIG__;
let score = 0;
const button = document.querySelector("#scoreButton");

document.title = config.title;

button.addEventListener("click", () => {
  score += 1;
  button.textContent = "Score " + score;
});`,
    },
  ];
};

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

const crc32 = (bytes) => {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
};

const toDosDateTime = (date) => {
  const year = Math.max(date.getFullYear(), 1980);
  const dosDate =
    ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const dosTime =
    (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);

  return { dosDate, dosTime };
};

const createZipBlob = (files) => {
  const encoder = new TextEncoder();
  const createdAt = new Date();
  const { dosDate, dosTime } = toDosDateTime(createdAt);
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.path.replace(/\\/g, "/"));
    const dataBytes =
      typeof file.content === "string" ? encoder.encode(file.content) : file.content;
    const checksum = crc32(dataBytes);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);

    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, dataBytes.length, true);
    localView.setUint32(22, dataBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);

    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, dataBytes.length, true);
    centralView.setUint32(24, dataBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralOffset = offset;
  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const endHeader = new Uint8Array(22);
  const endView = new DataView(endHeader.buffer);

  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, endHeader], {
    type: "application/zip",
  });
};

const createBrowserGameZip = (game) => {
  const zipBlob = createZipBlob(createBrowserGameFiles(game));
  return createFilePart([zipBlob], `${slugify(game.title)}.zip`, "application/zip");
};

const buildGameFormData = (game, tagsByName) => {
  const formData = new FormData();
  const tagIds = game.tags
    .map((tagName) => getEntityId(tagsByName.get(normalizeKey(tagName))))
    .filter(Boolean);

  if (tagIds.length === 0) {
    throw new Error(`No valid tags found for game "${game.title}"`);
  }

  formData.append("Title", game.title);
  formData.append("Description", game.description);
  formData.append("GameType", game.gameType);
  formData.append("Price", String(game.price));
  appendFile(formData, "Thumbnail", createThumbnail(game));
  appendFile(formData, "GameFile", createBrowserGameZip(game));

  for (const tagId of tagIds) {
    formData.append("TagIds", tagId);
  }

  return formData;
};

const buildPostFormData = (post) => {
  const formData = new FormData();

  formData.append("Title", post.title);
  formData.append("Content", post.content);

  return formData;
};

const fetchTags = async () => {
  const response = await api.get("/GameTags");
  return toArray(response.data);
};

const fetchGames = async () => {
  const response = await api.get("/Games", {
    params: { search: "", page: 1, pageSize: 200 },
  });

  return toArray(response.data);
};

const fetchPosts = async () => {
  const response = await api.get("/Post", {
    params: { Page: 1, PageSize: 200 },
  });

  return toArray(response.data);
};

const fetchGameComments = async (gameId) => {
  const response = await api.get(`/games/${gameId}/comment`, {
    params: { Page: 1, PageSize: 100 },
  });

  return toArray(response.data);
};

const fetchPostComments = async (postId) => {
  const response = await api.get(`/post/${postId}/comment`, {
    params: { Page: 1, PageSize: 100 },
  });

  return toArray(response.data);
};

const fetchMyFavoriteGames = async () => {
  const response = await api.get("/Users/gamefavorite");
  return toArray(response.data);
};

const fetchMyPurchasedGames = async () => {
  const response = await api.get("/Users/gamepaid");
  return toArray(response.data);
};

const loginAs = async (user) => {
  await api.post("/Auth/login", {
    username: user.username,
    password: user.password,
  });

  const response = await api.get("/Users/me");
  return response.data?.user || response.data?.data || response.data;
};

const signOut = async () => {
  try {
    await api.post("/Auth/signout");
  } catch (error) {
    warn("Could not sign out current session", getErrorMessage(error));
  }
};

const ensureUsers = async () => {
  const usersByKey = new Map();

  for (const user of DEMO_USERS) {
    try {
      await api.post("/Auth/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });
      log(`Registered user ${user.username}`);
    } catch (error) {
      if (!isConflict(error)) {
        throw new Error(`Register ${user.username} failed: ${getErrorMessage(error)}`);
      }

      log(`User ${user.username} already exists, logging in`);
    }

    const profile = await loginAs(user);
    const id = getEntityId(profile);

    if (!id) {
      throw new Error(`Could not resolve id for user ${user.username}`);
    }

    await api.patch("/Users/profile", { bio: user.bio });

    usersByKey.set(user.key, {
      ...user,
      id,
      profile,
    });
  }

  return usersByKey;
};

const ensureTags = async () => {
  const tagsByName = new Map(
    (await fetchTags()).map((tag) => [normalizeKey(getTagName(tag)), tag]),
  );

  for (const name of DEMO_TAGS) {
    const key = normalizeKey(name);

    if (tagsByName.has(key)) {
      log(`Tag ${name} already exists`);
      continue;
    }

    try {
      const response = await api.post("/GameTags", { name });
      tagsByName.set(key, response.data);
      log(`Created tag ${name}`);
    } catch (error) {
      const freshTags = await fetchTags();
      const existing = freshTags.find((tag) => normalizeKey(getTagName(tag)) === key);

      if (!existing) {
        throw new Error(`Create tag ${name} failed: ${getErrorMessage(error)}`);
      }

      tagsByName.set(key, existing);
      log(`Tag ${name} already exists`);
    }
  }

  return tagsByName;
};

const ensureGames = async (usersByKey, tagsByName) => {
  const gamesByTitle = new Map(
    (await fetchGames()).map((game) => [normalizeKey(getGameTitle(game)), game]),
  );

  for (const game of DEMO_GAMES) {
    const key = normalizeKey(game.title);

    if (gamesByTitle.has(key)) {
      log(`Game ${game.title} already exists`);
      continue;
    }

    const owner = usersByKey.get(game.ownerKey);

    if (!owner) {
      throw new Error(`Missing owner ${game.ownerKey} for game ${game.title}`);
    }

    await loginAs(owner);

    try {
      const response = await api.post("/Games", buildGameFormData(game, tagsByName));
      gamesByTitle.set(key, response.data);
      log(`Created game ${game.title}`);
    } catch (error) {
      throw new Error(`Create game ${game.title} failed: ${getErrorMessage(error)}`);
    }
  }

  return gamesByTitle;
};

const ensurePosts = async (usersByKey) => {
  const postsByTitle = new Map(
    (await fetchPosts()).map((post) => [normalizeKey(getPostTitle(post)), post]),
  );

  for (const post of DEMO_POSTS) {
    const key = normalizeKey(post.title);

    if (postsByTitle.has(key)) {
      log(`Post ${post.title} already exists`);
      continue;
    }

    const author = usersByKey.get(post.authorKey);

    if (!author) {
      throw new Error(`Missing author ${post.authorKey} for post ${post.title}`);
    }

    await loginAs(author);

    try {
      const response = await api.post("/Post", buildPostFormData(post));
      postsByTitle.set(key, response.data);
      log(`Created post ${post.title}`);
    } catch (error) {
      throw new Error(`Create post ${post.title} failed: ${getErrorMessage(error)}`);
    }
  }

  return postsByTitle;
};

const hasGameInList = (games, gameId) => {
  return games.some((game) => getEntityId(game) === gameId);
};

const hasComment = (comments, content) => {
  const key = normalizeKey(content);

  return comments.some((comment) => {
    const commentContent =
      comment?.content ||
      comment?.Content ||
      comment?.comment?.content ||
      comment?.Comment?.Content ||
      "";

    return normalizeKey(commentContent) === key;
  });
};

const ensureGameInteractions = async (
  usersByKey,
  gamesByTitle,
  { seedPlayEvents },
) => {
  for (const interaction of DEMO_GAME_INTERACTIONS) {
    const user = usersByKey.get(interaction.userKey);
    const game = gamesByTitle.get(normalizeKey(interaction.gameTitle));
    const gameId = getEntityId(game);

    if (!user || !gameId) {
      warn(`Skipping game interaction for ${interaction.gameTitle}`);
      continue;
    }

    await loginAs(user);

    if (interaction.rating) {
      await api.put(`/games/${gameId}/ratings`, { stars: interaction.rating });
      log(`Rated ${interaction.gameTitle} as ${interaction.rating}`);
    }

    if (interaction.favorite) {
      const favoriteGames = await fetchMyFavoriteGames();

      if (!hasGameInList(favoriteGames, gameId)) {
        await api.post(`/users/${gameId}/favrotite`);
        log(`Favorited ${interaction.gameTitle}`);
      }
    }

    if (interaction.purchase && getGamePrice(game) > 0) {
      const purchasedGames = await fetchMyPurchasedGames();

      if (!hasGameInList(purchasedGames, gameId)) {
        await api.post(`/games/${gameId}/purchase`, {
          // BE DTO is currently named "Amound"; keep this aligned with the API.
          amound: getGamePrice(game),
        });
        log(`Purchased ${interaction.gameTitle}`);
      }
    }

    if (interaction.comment) {
      const comments = await fetchGameComments(gameId);

      if (!hasComment(comments, interaction.comment)) {
        await api.post(`/games/${gameId}/comment`, {
          content: interaction.comment,
        });
        log(`Commented on ${interaction.gameTitle}`);
      }
    }

    if (seedPlayEvents) {
      for (let play = 0; play < (interaction.playCount || 0); play += 1) {
        await api.get(`/Games/${gameId}/play`);
      }
    }
  }
};

const ensurePostInteractions = async (usersByKey, postsByTitle) => {
  for (const interaction of DEMO_POST_INTERACTIONS) {
    const user = usersByKey.get(interaction.userKey);
    const post = postsByTitle.get(normalizeKey(interaction.postTitle));
    const postId = getEntityId(post);

    if (!user || !postId) {
      warn(`Skipping post interaction for ${interaction.postTitle}`);
      continue;
    }

    await loginAs(user);

    if (interaction.reactionType) {
      await api.post("/post/reaction", {
        postId,
        reactionType: interaction.reactionType,
      });
      log(`Reacted ${interaction.reactionType} on ${interaction.postTitle}`);
    }

    if (interaction.comment) {
      const comments = await fetchPostComments(postId);

      if (!hasComment(comments, interaction.comment)) {
        await api.post(`/post/${postId}/comment`, {
          content: interaction.comment,
        });
        log(`Commented on ${interaction.postTitle}`);
      }
    }
  }
};

const buildSeedSummary = (usersByKey, tagsByName, gamesByTitle, postsByTitle) => {
  return {
    apiBaseUrl: API_BASE_URL,
    demoPassword: DEMO_PASSWORD,
    users: Array.from(usersByKey.values()).map((user) => ({
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      id: user.id,
    })),
    tags: Array.from(tagsByName.values()).map((tag) => ({
      id: getEntityId(tag),
      name: getTagName(tag),
    })),
    games: Array.from(gamesByTitle.values()).map((game) => ({
      id: getEntityId(game),
      title: getGameTitle(game),
      price: getGamePrice(game),
    })),
    posts: Array.from(postsByTitle.values()).map((post) => ({
      id: getEntityId(post),
      title: getPostTitle(post),
    })),
  };
};

export const seedDemoData = async ({
  keepLoggedInAs = "playerOne",
  seedPlayEvents = true,
} = {}) => {
  log(`Starting seed against ${API_BASE_URL}`);

  const usersByKey = await ensureUsers();
  const tagsByName = await ensureTags();
  const gamesByTitle = await ensureGames(usersByKey, tagsByName);
  const postsByTitle = await ensurePosts(usersByKey);

  await ensureGameInteractions(usersByKey, gamesByTitle, { seedPlayEvents });
  await ensurePostInteractions(usersByKey, postsByTitle);

  const keepUser = usersByKey.get(keepLoggedInAs);

  if (keepUser) {
    await loginAs(keepUser);
    log(`Kept browser session logged in as ${keepUser.username}`);
  } else {
    await signOut();
  }

  const summary = buildSeedSummary(usersByKey, tagsByName, gamesByTitle, postsByTitle);
  log("Seed summary", summary);

  return summary;
};

if (typeof window !== "undefined") {
  window.seedFabricioDemoData = seedDemoData;

  const shouldAutoRun =
    new URLSearchParams(window.location.search).get("seedDemo") === "true";

  if (shouldAutoRun) {
    seedDemoData().catch((error) => {
      console.error("[seed] Seed failed", getErrorMessage(error), error);
    });
  }
}

export default seedDemoData;
