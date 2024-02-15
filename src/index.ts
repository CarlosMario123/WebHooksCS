import express, { Express, Request, Response } from "express";
import verifyKeyMiddleware from "./midleware/verify";
const app: Express = express();
app.use(express.json());

app.post("/api/github-event",verifyKeyMiddleware, (req: Request, res: Response) => {
  // Recuperar el body directamente desde req.body
  const { action, sender, repository, issue } = req.body;
  const evento = req.header("x-github-event");
  let mensaje = "";
    console.log(evento)

  switch (evento) {
    case "star":
      mensaje = `${sender.login} ${action} ${repository.full_name}`;
      break;

    case "issues":
      mensaje = `${sender.login} ${action} issue ${issue.title} en ${repository.full_name}`;
      break;

    case "push":
      mensaje = `${sender.login} pushes on ${repository.full_name}`;
      break;

    default:
      mensaje = `evento desconocido ${evento}`;
  }
    


   console.log(mensaje)
   peticion(mensaje)
  res.status(200).json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



function peticion(mensaje: string) {
  const webhookUrl = "https://discord.com/api/webhooks/1205602892862586921/W2n4vCqXRqXARjIip93663aw_5Jr1q2ClXTmJY08updgkroMfZAR3gmzFK3mk19bmOy4";

  const data = {
    content: mensaje
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text(); // Leer el cuerpo de la respuesta como texto
    })
    .then(result => {
      console.log("Mensaje enviado con éxito:", result);
    })
    .catch(error => {
      console.error("Error al enviar el mensaje:", error);
    });
}
