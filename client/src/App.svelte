<script lang="ts">
  import io from "socket.io-client";
  const socket = io();

  let playing = true;
  let code = "";

  function generateCode() {
    let code = "";

    let q = Math.random() < 0.5;
    const letters = ["aeiou", "bcdfghjklmnpqrstvwxyz"];
    for (let i = 0; i < 4; i++) {
      q = !q;
      code +=
        letters[q ? 0 : 1][
          Math.floor(Math.random() * letters[q ? 0 : 1].length)
        ];
    }
    return code;
  }

  function create() {
    code = generateCode();
    socket.emit("create", { code, playing }, (r) => {
      if (r?.error) {
        create();
      }
    });
  }

  socket.on("connect", () => {
    code = new URLSearchParams(window.location.search).get("j") ?? "";

    if (code) {
      socket.emit("join", { code, playing }, (r) => {
        console.log(r);
      });
    } else {
      create();
    }
  });
</script>

<input bind:checked={playing} type="checkbox" />
<label>{playing ? "Playing" : "Spectating"}</label>

<a href="{window.location.origin}?j={code}">
  <h1>#{code}</h1>
</a>
