import { NextSeo } from "next-seo";
import RubikConverter from "@/components/RubikConverter";

type Props = {};

const RubikConverterPage: React.FC<Props> = () => {

    return (
        <>
            <NextSeo
                title='Rubik Cube Image Converter — Photo to Mosaic'
                description="Turn any photo into a stunning Rubik's Cube mosaic. Upload an image, choose your grid resolution (up to 300×300), and watch it transform into a pixel-art grid of real Rubik's Cube faces. Explore individual cubes, toggle Floyd-Steinberg dithering for enhanced detail, and export as high-resolution PNG. Built with CIEDE2000 perceptual color matching in CIELAB space."
            />
            <main className="hero">
                <div className="hero-content text-center w-full max-w-5xl px-2 sm:px-4">
                    <div className="w-full">
                        <div className="prose md:prose-lg lg:prose-xl mx-auto mb-4">
                            <h2 className="text-2xl sm:text-3xl font-bold !mb-0">
                                Rubik&apos;s Cube Image Converter
                            </h2>

                            <small className="text-base-content">Transform any photo into a mosaic of Rubik&apos;s Cubes!</small>

                            <p className="md:!mt-3 text-sm sm:text-base">
                                Upload an image and watch it transform into a grid of Rubik&apos;s Cubes. Click on any cube to explore its front-face configuration.
                            </p>
                        </div>

                        <RubikConverter />
                    </div>
                </div>
            </main>
        </>
    )
}

export default RubikConverterPage