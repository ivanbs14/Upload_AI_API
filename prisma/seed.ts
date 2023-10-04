import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function main() {
   await prisma.prompt.deleteMany()

   await prisma.prompt.create({
      data: {
         title:'Titulo do Video',
         template: `Seu papel é gerar três títulos para um video do carregado.
         
         Abaixo voce recebera uma transcrição desse video, use essa transcrição [ara gerar os títulos.
         Abaixo voce recebera uma lista de títulos. use essa lista como referencia para os títulos a serem gerados.
         
         Os títulos devem ter no máximo 60 caracteres.
         Os títulos devem ser chamativos e atrativos para maximizar os cliques.
         
         Retorne apenas os tres títulos em formato de lista como no exemplo abaixo:
         ''''
         - Titulo 1
         - Titulo 2
         - Titulo 3
         '''
         
         Transcrição:
         ''''
         {transcription}
         '''`.trim()
      }
   })

   await prisma.prompt.create({
      data: {
         title: 'Descrição do video',
         template: `Seu papel é gerar uma criação sucinta para o video carregado.
         
         Abaixo voce recebera uma transcrição deste video, use essa transcrição para gera a descrição.
         
         A descrição deve possuir no máximo 80 palavras em primeira pessoa contendo os pontos principais do video.
         
         Use palavras chamativas e que cativam a atenção de quem esta lendo.
         
         Além disso, no final da descrição inclua uma lista de 3 até 10 hashtags em letra minuscula contendo palavras-chaves do video.
         
         O retorno deve seguir o formato:
         ''''
         Descrição.

         #hashtags1 #hashtags2 #hashtags3 ...
         ''''
         Transcrição:
         ''''
         {transcription}
         ''''`.trim()
      }
   })
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })