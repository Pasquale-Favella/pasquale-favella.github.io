import { pipeline, env, PipelineType } from "@xenova/transformers";

// Skip local model check
// @ts-ignore
env.allowLocalModels = false;

const RESPONSE_CONTEXT = `
Pasquale Favella, a software engineer hailing from the charming city of Naples, Italy, embodies the fusion of technical prowess with a creative spirit. Born in 1991, Pasquale initially embarked on a journey into the realm of chemical engineering, only to find his true calling in the intricate world of software programming and crafting.
While Pasquale holds a degree in chemical engineering, his heart beats to the rhythm of coding. With a penchant for full-stack development, he finds solace and excitement in frontend design, where his true passion lies. Whether it's architecting captivating user interfaces or diving deep into the intricacies of user experience, Pasquale thrives on the creative challenges that frontend development presents.
His toolkit is adorned with Angular and Java, tools he wields with finesse and expertise. Yet, it's his unwavering fascination with React and Next.js that sets his soul on fire. Pasquale's eyes light up with enthusiasm as he delves into the world of React components, crafting seamless and engaging user experiences that leave a lasting impression.
In the bustling world of software engineering, Pasquale Favella stands out as a beacon of innovation and dedication. His journey from chemical engineering to software development reflects his relentless pursuit of passion and excellence in every endeavor he undertakes. With each line of code he writes, Pasquale leaves an indelible mark on the digital landscape, shaping the future of technology with his ingenuity and expertise.
`

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task : PipelineType = 'question-answering';
    static model = 'Xenova/distilbert-base-uncased-distilled-squad';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (!Boolean(this.instance)) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

addEventListener('message', async (event: MessageEvent) => {
    //send evaluating message to the main thread
    postMessage({
        status: 'evaluating'
    });
    // Retrieve the answerer pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    const answerer = await PipelineSingleton.getInstance((x: any) => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        postMessage(x);
    });

    const output = await answerer(event.data.text, RESPONSE_CONTEXT);

    // Send the output back to the main thread
    postMessage({
        status: 'complete',
        output: output,
    });
});