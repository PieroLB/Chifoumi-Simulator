document.getElementById("start").addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const emojis = ["🪨", "🌿", "✂️"];
  const emojiSize = document.getElementById("emojiSize").value;
  const rangeDistanceDirection = [1, 3];
  const speed = 1;
  const nbrPlayers = document.getElementById("nbrPlayers").value;
  if (nbrPlayers < 3) alert("The minimum number of player is 3");
  const players = [];
  const update = () => {
    requestAnimationFrame(update);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${emojiSize}px Arial`;
    let n = [0, 0, 0];
    for (const player of players) {
      // Check if the player is close to the border.
      // If it's the case, we ajust its position
      let closeToTheBorder = false;
      if (player.x <= 0) {
        player.x += speed;
        closeToTheBorder = true;
      } else if (player.x >= canvas.width - emojiSize) {
        player.x -= speed;
        closeToTheBorder = true;
      }
      if (player.y <= emojiSize) {
        player.y += speed;
        closeToTheBorder = true;
      } else if (player.y >= canvas.height) {
        player.y -= speed;
        closeToTheBorder = true;
      }
      // If it's not the case, if a direction has already been calculated, we we continue in this direction, otherwise we calculate a new direction
      if (!closeToTheBorder) {
        // Check if a new direction has to be calculated
        if (player.direction.x === 0 && player.direction.y === 0) {
          const distanceX =
            Math.floor(Math.random() * rangeDistanceDirection[1]) +
            rangeDistanceDirection[0];
          const distanceY =
            Math.floor(Math.random() * rangeDistanceDirection[1]) +
            rangeDistanceDirection[0];
          player.direction.x = Math.random() >= 0.5 ? distanceX : -distanceX;
          player.direction.y = Math.random() >= 0.5 ? distanceY : -distanceY;
        }

        // Move the player following its direction
        player.x += Math.sign(player.direction.x) * speed;
        player.y += Math.sign(player.direction.y) * speed;

        player.direction.x -= Math.sign(player.direction.x) * speed;
        player.direction.y -= Math.sign(player.direction.y) * speed;
      }
      // Check of the collision between the player
      if (player.checkCollision != false) {
        for (const player2 of players) {
          if (
            Math.abs(player.x - player2.x) <= emojiSize &&
            Math.abs(player.y - player2.y) <= emojiSize
          ) {
            if (player.emoji == "🪨" && player2.emoji == "✂️") {
              player2.emoji = "🪨";
              player2.checkCollision = false;
            } else if (player.emoji == "🌿" && player2.emoji == "🪨") {
              player2.emoji = "🌿";
              player2.checkCollision = false;
            } else if (player.emoji == "✂️" && player2.emoji == "🌿") {
              player2.emoji = "✂️";
              player2.checkCollision = false;
            } else {
              player.emoji = player.emoji;
              player.checkCollision = false;
            }
          }
        }
      } else {
        player.checkCollision = true;
      }
      n[emojis.indexOf(player.emoji)]++;
      ctx.fillText(player.emoji, player.x, player.y);
    }
    let i = 0;
    document.querySelectorAll(".ui span").forEach((span) => {
      span.textContent = n[i];
      i++;
    });
  };

  for (const emoji of emojis) {
    for (let i = 1; i <= Math.floor(nbrPlayers / 3); i++) {
      let attempts = 0;
      const maxAttempts = 1000; // Limite arbitraire pour éviter une boucle infinie
      let x = null;
      let y = null;
      let pass = false;
      while (!pass && attempts < maxAttempts) {
        pass = true;
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
        attempts++;

        if (
          x <= emojiSize ||
          x >= canvas.width - emojiSize ||
          y <= emojiSize ||
          y >= canvas.height - emojiSize
        ) {
          pass = false;
          continue;
        }
        for (const player of players) {
          if (
            Math.abs(x - player.x) <= emojiSize &&
            Math.abs(y - player.y) <= emojiSize
          ) {
            pass = false;
            break;
          }
        }
      }

      if (attempts === maxAttempts) {
        console.warn(
          "Impossible de placer un emoji après plusieurs tentatives"
        );
        break; // Sortir de la boucle si nécessaire
      } else {
        players.push({
          emoji: emoji,
          x: x,
          y: y,
          direction: { x: 0, y: 0 },
          checkCollision: true,
        });
      }
    }
  }
  document.getElementById("parameters").remove();
  document.getElementById("ui").style.display = "block";
  update();
});
