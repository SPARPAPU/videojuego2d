
(() => {
    "use strict";

    // ==========================================
    // ELEMENTOS HTML
    // ==========================================
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const el = {
        score: document.getElementById("score"),
        active: document.getElementById("active-count"),
        accuracy: document.getElementById("accuracy"),
        status: document.getElementById("status"),

        startHint: document.getElementById("start-hint"),
        startBtn: document.getElementById("start-btn"),

        toast: document.getElementById("toast"),

        gameOver: document.getElementById("game-over"),
        finalScore: document.getElementById("final-score"),
        gameOverReset: document.getElementById("game-over-reset"),

        ammoCount: document.getElementById("ammo-count"),
        ammoIcons: document.getElementById("ammo-icons"),
        ammoMessage: document.getElementById("ammo-message"),

        livesCount: document.getElementById("lives-count"),

        pauseBtn: document.getElementById("pause-btn"),
        resetBtn: document.getElementById("reset-btn"),
        soundBtn: document.getElementById("sound-btn"),

        music: document.getElementById("bg-music"),
        gameoverMusic: document.getElementById("gameover-music")
    };

    // ==========================================
    // CONFIGURACIÓN DEL PROTOCOLO NS-25
    // ==========================================
    const CONFIG = {
        monsterCount: 25,
        initialLives: 7,
        magazineSize: 10,
        reloadMs: 3000,
        minSpeed: 22,
        maxSpeed: 68,
        collisionRestitution: 0.88
    };

    const monsterFiles = [
        "assets/dracula.png",
        "assets/frankenstein.png",
        "assets/hombre-lobo.png",
        "assets/esqueleto.png",
        "assets/jinete-sin-cabeza.png"
    ];

    const monsterImages = monsterFiles.map(src => {
        const image = new Image();
        image.src = src;
        return image;
    });

    const backgroundImage = new Image();
    backgroundImage.src = "assets/cementerio-nocturno.jpg";

    // ==========================================
    // ESTADO DEL JUEGO
    // ==========================================
    let W = 800;
    let H = 500;
    let dpr = 1;

    let monsters = [];
    let particles = [];

    let score = 0;
    let shots = 0;
    let hits = 0;
    let lives = CONFIG.initialLives;
    let ammo = CONFIG.magazineSize;

    let started = false;
    let paused = false;
    let gameOver = false;

    let reloading = false;
    let reloadEndsAt = 0;

    let lastFrame = 0;
    let nextMonsterId = 1;
    let toastTimeout = null;

    const mouse = { x: -100, y: -100 };
    const collisionCooldown = new Map();

    const rand = (min, max) => Math.random() * (max - min) + min;

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    // ==========================================
    // AUDIO
    // ==========================================
    function stopAudio(audio) {
        if (!audio) return;

        audio.pause();

        try {
            audio.currentTime = 0;
        } catch (error) {
            // El navegador puede no haber cargado aún el audio.
        }
    }

    async function playFromStart(audio) {
        if (!audio) return;

        audio.pause();

        try {
            audio.currentTime = 0;
            await audio.play();
        } catch (error) {
            console.warn("No se pudo reproducir el audio:", error);
        }
    }

    function startGameMusic() {
        stopAudio(el.gameoverMusic);
        playFromStart(el.music);

        el.soundBtn.textContent = "♫ Silenciar audio";
    }

    function startGameOverMusic() {
        stopAudio(el.music);
        playFromStart(el.gameoverMusic);

        el.soundBtn.textContent = "♫ Activar audio";
    }

    function toggleAudio() {
        const audio = gameOver ? el.gameoverMusic : el.music;

        if (!audio) return;

        if (audio.paused) {
            audio.play()
                .then(() => {
                    el.soundBtn.textContent = "♫ Silenciar audio";
                })
                .catch(() => {
                    showToast("No se pudo reproducir el audio.", 1500);
                });
        } else {
            audio.pause();
            el.soundBtn.textContent = "♫ Activar audio";
        }
    }

    // ==========================================
    // MENSAJES TEMPORALES
    // ==========================================
    function showToast(message, duration = 1000) {
        el.toast.textContent = message;
        el.toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            el.toast.classList.remove("show");
        }, duration);
    }

    // ==========================================
    // MUNICIÓN
    // ==========================================
    function buildAmmoIcons() {
        el.ammoIcons.replaceChildren();

        for (let i = 0; i < CONFIG.magazineSize; i++) {
            const image = document.createElement("img");

            image.className = "ammo-round";
            image.src = "assets/municion.png";
            image.alt = `Bala ${i + 1}`;

            image.onerror = () => {
                image.style.display = "none";
            };

            el.ammoIcons.appendChild(image);
        }

        updateAmmoUI();
    }

    function updateAmmoUI() {
        el.ammoCount.textContent =
            `${ammo} / ${CONFIG.magazineSize}`;

        const icons = el.ammoIcons.querySelectorAll(".ammo-round");

        icons.forEach((icon, index) => {
            icon.classList.toggle("spent", index >= ammo);
        });

        el.ammoMessage.classList.toggle("reloading", reloading);

        if (reloading) {
            el.ammoMessage.textContent = "RECARGANDO…";
        } else if (ammo === 0) {
            el.ammoMessage.textContent = "CARGADOR VACÍO";
        } else {
            el.ammoMessage.textContent = "LISTO PARA DISPARAR";
        }
    }

    // ==========================================
    // MARCADOR
    // ==========================================
    function updateHUD() {
        el.score.textContent = score;
        el.active.textContent = monsters.length;

        el.accuracy.textContent = shots
            ? `${Math.round((hits / shots) * 100)}%`
            : "—";

        el.livesCount.textContent = lives;

        if (gameOver) {
            el.status.textContent = "PROTOCOLO FALLIDO";
        } else if (paused) {
            el.status.textContent = "EN PAUSA";
        } else if (reloading) {
            el.status.textContent = "RECARGANDO";
        } else if (started) {
            el.status.textContent = "EN COMBATE";
        } else {
            el.status.textContent = "EN VIGILIA";
        }

        updateAmmoUI();
    }

    // ==========================================
    // CREACIÓN DE MONSTRUOS
    // ==========================================
    function makeMonster() {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(CONFIG.minSpeed, CONFIG.maxSpeed);
        const radius = rand(23, 32);

        return {
            id: nextMonsterId++,
            imageIndex: Math.floor(Math.random() * monsterImages.length),

            x: rand(radius + 5, Math.max(radius + 6, W - radius - 5)),
            y: rand(radius + 5, Math.max(radius + 6, H - radius - 5)),

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            r: radius,
            phase: rand(0, Math.PI * 2),
            phaseSpeed: rand(0.5, 1.6),
            flash: 0
        };
    }

    function createMonsters() {
        nextMonsterId = 1;

        monsters = Array.from(
            { length: CONFIG.monsterCount },
            () => makeMonster()
        );
    }

    // ==========================================
    // REINICIO E INICIO DEL PROTOCOLO
    // ==========================================
    function resetGame() {
        stopAudio(el.music);
        stopAudio(el.gameoverMusic);

        score = 0;
        shots = 0;
        hits = 0;
        lives = CONFIG.initialLives;
        ammo = CONFIG.magazineSize;

        started = false;
        paused = false;
        gameOver = false;

        reloading = false;
        reloadEndsAt = 0;

        particles = [];
        collisionCooldown.clear();

        clearTimeout(toastTimeout);
        el.toast.classList.remove("show");

        createMonsters();

        el.startHint.hidden = false;
        el.gameOver.hidden = true;

        el.pauseBtn.textContent = "Pausar";
        el.soundBtn.textContent = "♫ Activar audio";

        updateHUD();
        draw(performance.now());
    }

    function startGame() {
        if (gameOver || started) return;

        started = true;
        paused = false;

        el.startHint.hidden = true;
        el.pauseBtn.textContent = "Pausar";

        startGameMusic();
        updateHUD();
    }

    function endGame() {
        if (gameOver) return;

        gameOver = true;
        started = false;
        paused = false;
        reloading = false;

        el.finalScore.textContent = score;

        el.startHint.hidden = true;
        el.gameOver.hidden = false;

        // Detiene terror.mp3 y reinicia gameover.mp3.
        startGameOverMusic();

        updateHUD();
    }

    // ==========================================
    // RECARGA AUTOMÁTICA
    // ==========================================
    function startReload(now) {
        if (reloading || ammo > 0 || gameOver) return;

        reloading = true;
        reloadEndsAt = now + CONFIG.reloadMs;

        updateHUD();
        showToast("PROTOCOLO DE RECARGA ACTIVADO", 1300);
    }

    function updateReload(now) {
        if (!reloading || now < reloadEndsAt) return;

        reloading = false;
        ammo = CONFIG.magazineSize;

        updateHUD();
        showToast("MUNICIÓN RESTABLECIDA", 900);
    }

    // ==========================================
    // CHISPAS Y PARTÍCULAS
    // ==========================================
    function burst(x, y, color = "#ff873b", count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = rand(0, Math.PI * 2);
            const speed = rand(35, 190);
            const life = rand(0.18, 0.48);

            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life,
                maxLife: life,
                size: rand(1.3, 3.5),
                color
            });
        }
    }

    function updateParticles(dt) {
        for (const p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            p.vx *= Math.pow(0.12, dt);
            p.vy *= Math.pow(0.12, dt);

            p.life -= dt;
        }

        particles = particles.filter(p => p.life > 0);
    }

    // ==========================================
    // MOVIMIENTO Y REBOTE EN LOS BORDES
    // ==========================================
    function moveMonster(monster, dt) {
        monster.phase += monster.phaseSpeed * dt;

        const sway = Math.sin(monster.phase) * 10;

        monster.x += (monster.vx + sway) * dt;
        monster.y += monster.vy * dt;

        monster.flash = Math.max(0, monster.flash - dt);

        const pad = monster.r * 0.72;

        if (monster.x < pad) {
            monster.x = pad;
            monster.vx = Math.abs(monster.vx);

            burst(monster.x, monster.y, "#ff873b", 7);
            monster.flash = 0.14;
        } else if (monster.x > W - pad) {
            monster.x = W - pad;
            monster.vx = -Math.abs(monster.vx);

            burst(monster.x, monster.y, "#ff873b", 7);
            monster.flash = 0.14;
        }

        if (monster.y < pad) {
            monster.y = pad;
            monster.vy = Math.abs(monster.vy);

            burst(monster.x, monster.y, "#ff873b", 7);
            monster.flash = 0.14;
        } else if (monster.y > H - pad) {
            monster.y = H - pad;
            monster.vy = -Math.abs(monster.vy);

            burst(monster.x, monster.y, "#ff873b", 7);
            monster.flash = 0.14;
        }
    }

    // ==========================================
    // COLISIONES ENTRE MONSTRUOS
    // ==========================================
    function resolveMonsterCollisions(now) {
        const activePairs = new Set();

        for (let i = 0; i < monsters.length; i++) {
            for (let j = i + 1; j < monsters.length; j++) {
                const a = monsters[i];
                const b = monsters[j];

                let dx = b.x - a.x;
                let dy = b.y - a.y;

                let distance = Math.hypot(dx, dy);
                const minDistance = (a.r + b.r) * 0.72;

                if (distance >= minDistance) continue;

                if (distance < 0.001) {
                    dx = 1;
                    dy = 0;
                    distance = 1;
                }

                const nx = dx / distance;
                const ny = dy / distance;

                const key =
                    `${Math.min(a.id, b.id)}:${Math.max(a.id, b.id)}`;

                activePairs.add(key);

                // Separar las figuras que se superponen.
                const overlap = minDistance - distance + 0.3;

                a.x -= nx * overlap * 0.5;
                a.y -= ny * overlap * 0.5;

                b.x += nx * overlap * 0.5;
                b.y += ny * overlap * 0.5;

                // Intercambio de velocidad en la dirección de la colisión.
                const relativeVelocity =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;

                if (relativeVelocity < 0) {
                    const impulse =
                        -(1 + CONFIG.collisionRestitution) *
                        relativeVelocity / 2;

                    a.vx -= impulse * nx;
                    a.vy -= impulse * ny;

                    b.vx += impulse * nx;
                    b.vy += impulse * ny;
                }

                // Limitar los efectos de colisión repetidos.
                const previousCollision = collisionCooldown.get(key) ?? 0;

                if (now - previousCollision > 300) {
                    const cx = (a.x + b.x) / 2;
                    const cy = (a.y + b.y) / 2;

                    burst(cx, cy, "#ff873b", 12);
                    burst(cx, cy, "#ffd18a", 5);

                    a.flash = 0.16;
                    b.flash = 0.16;

                    collisionCooldown.set(key, now);
                }
            }
        }

        for (const key of collisionCooldown.keys()) {
            if (!activePairs.has(key)) {
                collisionCooldown.delete(key);
            }
        }
    }

    // ==========================================
    // FONDO DEL ESCENARIO
    // ==========================================
    function drawBackground() {
        if (backgroundImage.complete && backgroundImage.naturalWidth) {
            const scale = Math.max(
                W / backgroundImage.naturalWidth,
                H / backgroundImage.naturalHeight
            );

            const sourceWidth = W / scale;
            const sourceHeight = H / scale;

            const sx = (backgroundImage.naturalWidth - sourceWidth) / 2;
            const sy = (backgroundImage.naturalHeight - sourceHeight) / 2;

            ctx.drawImage(
                backgroundImage,
                sx, sy,
                sourceWidth, sourceHeight,
                0, 0, W, H
            );

            ctx.fillStyle = "rgba(5, 9, 17, .45)";
            ctx.fillRect(0, 0, W, H);
        } else {
            // Fondo de respaldo si la imagen no está disponible.
            const gradient = ctx.createLinearGradient(0, 0, 0, H);

            gradient.addColorStop(0, "#182334");
            gradient.addColorStop(1, "#080b11");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, W, H);

            // Luna.
            ctx.fillStyle = "rgba(220, 222, 211, .16)";
            ctx.beginPath();
            ctx.arc(
                W * 0.78,
                H * 0.18,
                Math.min(W, H) * 0.07,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Lápidas.
            ctx.fillStyle = "#0a0d13";

            for (let i = 0; i < 12; i++) {
                const x = (i / 12) * W + 8;
                const height = 25 + (i % 4) * 12;

                ctx.fillRect(x, H - height, 17, height);

                ctx.beginPath();
                ctx.arc(x + 8.5, H - height, 8.5, Math.PI, 0);
                ctx.fill();
            }
        }

        const vignette = ctx.createRadialGradient(
            W / 2, H / 2, H * 0.15,
            W / 2, H / 2, Math.max(W, H) * 0.7
        );

        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,.62)");

        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);
    }

    // ==========================================
    // DIBUJO DE MONSTRUOS
    // ==========================================
    function drawFallbackMonster(monster) {
        const colors = [
            "#8d3840",
            "#657d86",
            "#697b4d",
            "#c4c5b8",
            "#6c596f"
        ];

        ctx.fillStyle = colors[monster.imageIndex];
        ctx.strokeStyle = "#17141b";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            monster.r * 0.67,
            monster.r * 0.85,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        // Ojos.
        ctx.fillStyle = "#f3a35b";
        ctx.beginPath();
        ctx.arc(-monster.r * 0.23, -monster.r * 0.1, 3, 0, Math.PI * 2);
        ctx.arc(monster.r * 0.23, -monster.r * 0.1, 3, 0, Math.PI * 2);
        ctx.fill();

        // Boca.
        ctx.strokeStyle = "#17141b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-monster.r * 0.2, monster.r * 0.25);
        ctx.lineTo(monster.r * 0.2, monster.r * 0.25);
        ctx.stroke();
    }

    function drawMonster(monster, time) {
        const image = monsterImages[monster.imageIndex];
        const bob = Math.sin(time / 300 + monster.phase) * 3;

        ctx.save();
        ctx.translate(monster.x, monster.y + bob);

        // Sombra.
        ctx.fillStyle = "rgba(0,0,0,.42)";
        ctx.beginPath();
        ctx.ellipse(
            0,
            monster.r * 0.65,
            monster.r * 0.85,
            monster.r * 0.27,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        if (image && image.complete && image.naturalWidth) {
            ctx.drawImage(
                image,
                -monster.r,
                -monster.r,
                monster.r * 2,
                monster.r * 2
            );
        } else {
            drawFallbackMonster(monster);
        }

        if (monster.flash > 0) {
            ctx.globalCompositeOperation = "screen";
            ctx.fillStyle =
                `rgba(255, 137, 55, ${Math.min(0.7, monster.flash * 4)})`;

            ctx.beginPath();
            ctx.arc(0, 0, monster.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // ==========================================
    // CRUCETA DE APUNTADO
    // ==========================================
    function drawCrosshair() {
        if (!started || paused || gameOver) return;

        ctx.save();
        ctx.translate(mouse.x, mouse.y);

        ctx.strokeStyle = "#ff873b";
        ctx.lineWidth = 1.6;
        ctx.shadowColor = "#ff873b";
        ctx.shadowBlur = 9;

        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);

        ctx.moveTo(-20, 0);
        ctx.lineTo(-6, 0);

        ctx.moveTo(6, 0);
        ctx.lineTo(20, 0);

        ctx.moveTo(0, -20);
        ctx.lineTo(0, -6);

        ctx.moveTo(0, 6);
        ctx.lineTo(0, 20);

        ctx.stroke();
        ctx.restore();
    }

    // ==========================================
    // DIBUJO COMPLETO DEL ESCENARIO
    // ==========================================
    function draw(time = 0) {
        if (!ctx || !W || !H) return;

        ctx.clearRect(0, 0, W, H);

        drawBackground();

        monsters.forEach(monster => drawMonster(monster, time));

        // Partículas.
        for (const particle of particles) {
            ctx.save();

            ctx.globalAlpha = clamp(
                particle.life / particle.maxLife,
                0,
                1
            );

            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 7;

            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.restore();
        }

        drawCrosshair();
    }

    // ==========================================
    // AJUSTAR CANVAS A LA PANTALLA
    // ==========================================
    function resize() {
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        dpr = Math.min(window.devicePixelRatio || 1, 2);

        W = rect.width;
        H = rect.height;

        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        monsters.forEach(monster => {
            const pad = monster.r * 0.75;

            monster.x = clamp(monster.x, pad, W - pad);
            monster.y = clamp(monster.y, pad, H - pad);
        });

        draw(performance.now());
    }

    function pointFromEvent(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    // ==========================================
    // DISPAROS
    // ==========================================
    function fire(event) {
        const point = pointFromEvent(event);

        mouse.x = point.x;
        mouse.y = point.y;

        if (!started || paused || gameOver) return;

        const now = performance.now();

        if (reloading || ammo <= 0) {
            if (ammo <= 0 && !reloading) {
                startReload(now);
            }

            showToast("SIN MUNICIÓN · ESPERA LA RECARGA", 700);
            return;
        }

        // Cada disparo consume una bala.
        shots++;
        ammo--;

        let hitIndex = -1;

        // Comprobar si el disparo acertó a un monstruo.
        for (let i = monsters.length - 1; i >= 0; i--) {
            const monster = monsters[i];
            const hitRadius = monster.r * 0.88;

            if (
                Math.hypot(
                    point.x - monster.x,
                    point.y - monster.y
                ) <= hitRadius
            ) {
                hitIndex = i;
                break;
            }
        }

        if (hitIndex >= 0) {
            const [target] = monsters.splice(hitIndex, 1);

            score++;
            hits++;

            burst(target.x, target.y, "#ff873b", 20);
            burst(target.x, target.y, "#ffd18a", 8);

            showToast("OBJETIVO NEUTRALIZADO", 650);

            // El objetivo reaparece para mantener 25 monstruos activos.
            const replacement = makeMonster();
            replacement.id = nextMonsterId++;

            monsters.push(replacement);
        } else {
            // Los disparos fallidos restan vidas.
            lives--;

            burst(point.x, point.y, "#ff873b", 7);

            showToast(
                `DISPARO FALLIDO · VIDAS RESTANTES: ${lives}`,
                750
            );

            if (lives <= 0) {
                lives = 0;
                updateHUD();
                endGame();
                return;
            }
        }

        if (ammo === 0) {
            startReload(now);
        }

        updateHUD();
    }

    // ==========================================
    // BUCLE PRINCIPAL
    // ==========================================
    function loop(time) {
        const dt = lastFrame
            ? Math.min((time - lastFrame) / 1000, 0.04)
            : 0;

        lastFrame = time;

        if (started && !paused && !gameOver) {
            updateReload(time);

            monsters.forEach(monster => moveMonster(monster, dt));
            resolveMonsterCollisions(time);
            updateParticles(dt);
        } else if (particles.length) {
            updateParticles(dt);
        }

        draw(time);
        requestAnimationFrame(loop);
    }

    // ==========================================
    // EVENTOS
    // ==========================================
    canvas.addEventListener("pointermove", event => {
        const point = pointFromEvent(event);

        mouse.x = point.x;
        mouse.y = point.y;
    });

    canvas.addEventListener("pointerdown", event => {
        if (event.button !== undefined && event.button !== 0) return;
        fire(event);
    });

    el.startBtn.addEventListener("click", startGame);

    el.pauseBtn.addEventListener("click", () => {
        if (!started || gameOver) return;

        paused = !paused;

        el.pauseBtn.textContent = paused
            ? "Continuar"
            : "Pausar";

        updateHUD();
    });

    el.resetBtn.addEventListener("click", resetGame);
    el.gameOverReset.addEventListener("click", resetGame);
    el.soundBtn.addEventListener("click", toggleAudio);

    window.addEventListener("resize", resize);

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    buildAmmoIcons();
    resetGame();
    resize();
    requestAnimationFrame(loop);
})();
