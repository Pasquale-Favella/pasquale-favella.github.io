import { pipeline, env, PipelineType } from "@huggingface/transformers";

// Skip local model check
// @ts-ignore
env.allowLocalModels = false;

const RESPONSE_CONTEXT = `
Pasquale Favella is a software engineer from Naples, Italy, born in 1991, whose journey reflects the uncommon fusion of analytical precision and creative vision. After earning a degree in chemical engineering, he redirected his curiosity and problem-solving skills toward software development, where he discovered a true vocation.
With more than a decade of experience, Pasquale has worked across diverse industries—banking, energy, and maritime logistics—designing complex systems that range from big data pipelines to high-impact frontend platforms. His toolkit spans Java, Spring Boot, Angular, and databases like MongoDB and Oracle, but his true passion lies in frontend design, particularly with React and Next.js, where he brings ideas to life through clean, engaging, and user-centered interfaces.
Beyond technical delivery, Pasquale thrives as a mentor and enabler. He has guided juniors and seniors alike, often transforming underperforming teams into cohesive groups capable of delivering ambitious projects. His leadership style is grounded in active listening, empathy, and the ability to reveal potential in others, earning him recognition as both a reliable engineer and a trusted tutor.
What sets Pasquale apart is his ability to connect technical depth with human impact: from orchestrating microservices pipelines for major banks, to creating intuitive onboarding apps with non-technical colleagues, to experimenting with local-first applications and AI-driven user experiences in his personal projects. Each project carries his signature blend of rigor, creativity, and curiosity.
Pasquale Favella embodies the figure of the modern engineer: not only a builder of systems, but a catalyst for growth, collaboration, and innovation.
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