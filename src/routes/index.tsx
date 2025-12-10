import { createFileRoute } from "@tanstack/react-router";
import { NowPlaying } from "@/components/NowPlaying";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
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
					<br />I started coding as a teenager, but I am currently focused on
					rigorous engineering at Tufts University. I've spent my summer scaling
					AI infrastructure & bug squashing at Delphi.
					<br />
					<br />I am obsessed with autonomy, aesthetics, and efficiency. I build
					things to learn how they break, then I build them again.
				</p>
				<div className="flex gap-2">
					<img src="/uk.svg" alt="UK" />
					<img src="/us.png" alt="USA" />
				</div>
				<NowPlaying />
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
					<a href="https://github.com/tikacapon" className="hover:underline">
						GitHub
					</a>
				</div>
			</div>
		</div>
	);
}
