import { createFileRoute } from "@tanstack/react-router";
import { NowPlaying } from "@/components/NowPlaying";
import { GradientBackground } from "@/components/ui/noisy-gradient-backgrounds";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<GradientBackground
			gradientOrigin="bottom-left"
			colors={[
				{ color: "#001E53", stop: "0%" },
				{ color: "#001E53", stop: "30%" },
				{ color: "#00265B", stop: "45%" },
				{ color: "#00144C", stop: "85%" },
				{ color: "#00265B", stop: "100%" },
			]}
			noiseIntensity={0.6}
			noisePatternSize={130}
			noisePatternRefreshInterval={2}
		>
			<div className="px-[10vw] md:px-[25vw] py-[5vh] text-white min-h-screen flex justify-center items-center">
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-headline text-4xl font-black">TIKA CAPON</p>
							<p className="font-semibold">Product Architect & Engineer</p>
						</div>

						<img src="/clover.svg" alt="Clover" className="h-15" />
					</div>
					<p>
						I am an engineer interested in how things work—whether that's a
						mechanical assembly, a software pipeline, or a musical composition.
						<br />
						<br />I study Mechanical Engineering at Tufts University. I spent my
						summer at Delphi on AWS infrastructure, growth engineering, and data
						analysis.
						<br />
						<br />I am obsessed with autonomy, aesthetics, and efficiency. I
						build things to learn how they break, then I build them again.
					</p>
					<div className="flex justify-between items-center">
						<div className="flex gap-2">
							<img src="/uk.svg" alt="UK" className="h-12" />
							<img src="/us.svg" alt="USA" className="h-12" />
						</div>
						<NowPlaying />
					</div>

					<div className="flex justify-between font-semibold">
						<a href="https://x.com/iocapon" className="hover:underline">
							X
						</a>
						<a href="mailto:tika@capon.io" className="hover:underline">
							Email
						</a>
						<a
							href="https://www.linkedin.com/in/tikacapon/"
							className="hover:underline"
						>
							LinkedIn
						</a>
						<a href="https://github.com/tika" className="hover:underline">
							GitHub
						</a>
					</div>
				</div>
			</div>
		</GradientBackground>
	);
}
