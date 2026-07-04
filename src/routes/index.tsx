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
			<div className="px-[10vw] md:px-[25vw]py-[5vh] text-white flex justify-center items-center min-h-screen">
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-headline text-4xl font-black">TIKA CAPON</p>
							<p className="font-semibold">Product Architect & Engineer</p>
						</div>

						<img src="/clover.svg" alt="Clover" className="h-15 hidden sm:block" draggable={false} />
					</div>
					<p className="max-w-[692px]">
						Building product at <a href="https://interfere.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Interfere Inc.</a><br /><br />
						Mechanical Engineering at UCL (via Tufts University)<br /><br /> 
						Last summer I was at <a href="https://delphi.ai" target="_blank" rel="noopener noreferrer" className="hover:underline">Delphi</a>: AWS infra, growth engineering, and full-stack development
						<br />
						<br />I am obsessed with autonomy, aesthetics, and efficiency. I
						build things to learn how they break, then I build them again.
					</p>
					<div className="flex justify-between items-center">
						<div className="flex gap-2">
							<img
								src="/uk.svg"
								alt="UK"
								title="PLACE OF ORIGIN"
								className="h-12"
								draggable={false}
							/>
							<img
								src="/us.svg"
								alt="USA"
								title="PLACE OF BUSINESS"
								className="h-12"
								draggable={false}
							/>
						</div>
						<NowPlaying />
					</div>

					<div className="flex justify-between font-semibold">
						<a href="https://x.com/iocapon" className="hover:underline" title="SOCIAL">
							X
						</a>
						<a href="mailto:tika@capon.io" className="hover:underline" title="EMAIL">
							Email
						</a>
						<a
							href="https://www.linkedin.com/in/tikacapon/"
							className="hover:underline"
							title="NETWORKING"
						>
							LinkedIn
						</a>
						<a href="https://github.com/tika" className="hover:underline" title="WORK">
							GitHub
						</a>
					</div>
				</div>
			</div>
		</GradientBackground>
	);
}
