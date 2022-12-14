import { Amiami } from "./amiami";
import { PrismaClient } from '@prisma/client';
const amiami = new Amiami();

const prisma = new PrismaClient()

const runtime = async () => {
    amiami.fetchAmiamiLatest().then((results) => {
        console.log(results);
        results.forEach(async (figure) => {
            const existingFigure = await prisma.figure.findUnique({
                where: {
                    code: figure.code
                },
            });
    
            console.log(existingFigure ? true : false);
            if(existingFigure === null)
            {
                await prisma.figure.create({
                    data: {
                        code: figure.code!,
                        url: figure.url!,
                        image: figure.imageurl!,
                        title: figure.title!,
                    }
                });
            }
        })
    });
};

const timer:ReturnType<typeof setInterval> = setInterval(() => {
    runtime();
}, 1800000);

runtime();

