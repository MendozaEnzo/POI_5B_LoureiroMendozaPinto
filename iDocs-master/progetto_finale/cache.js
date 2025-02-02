const upload = (data) => {
  return new Promise((resolve, reject) => {
    fetch("./conf.json")
      .then((r) => r.json())
      .then((confData) => {
        try {
          console.log("Dati inviati al server per il salvataggio:", data);
          fetch(confData.url + "set", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'key': confData.token,
            },
            body: JSON.stringify({
              key: confData.key,
              value: data,
            }),
          })
            .then((r) => r.json())
            .then((response) => {
              console.log("Risposta dal server dopo il salvataggio:", response);
              resolve();
            });
        } catch (error) {
          reject(error);
        }
      });
  });
};

const download = () => {
  return new Promise((resolve, reject) => {
    fetch("./conf.json")
      .then((r) => r.json())
      .then((confData) => {
        try {
          fetch(confData.url + "get", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'key': confData.token,
            },
            body: JSON.stringify({
              key: confData.key,
            }),
          })
            .then((r) => r.json())
            .then((data) => {
              console.log("Dati scaricati dal server:", data.result);
              resolve(data.result);
            });
        } catch (error) {
          reject(error);
        }
      });
  });
};

export { upload, download };
