module.exports = [
  {
    name: "c2-reactjs",
    script: "node server/index",
    ignore_watch: ["node_modules"],
    instances: 1,
    autorestart: true,
    max_memory_restart: "1G",
    env: {
      REACT_APP_STAGE: "dev",
      PORT: 3000,
      NODE_ENV: "dev",
    },
  },
];
