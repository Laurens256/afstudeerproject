const Skip = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 152 152" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<g filter="url(#filter0_d_25_514)">
			<circle
				cx="78"
				cy="74"
				r="63.5"
				stroke="black"
				strokeWidth="21"
				shapeRendering="crispEdges"
			/>
		</g>
		<circle
			cx="78"
			cy="74"
			r="63.5"
			stroke="white"
			strokeWidth="15"
		/>
		<line
			x1="39.2163"
			y1="111.211"
			x2="114.967"
			y2="35.46"
			stroke="black"
			strokeWidth="21"
		/>
		<line
			x1="37.4032"
			y1="113.092"
			x2="116.969"
			y2="33.5268"
			stroke="white"
			strokeWidth="15"
		/>
		<defs>
			<filter
				id="filter0_d_25_514"
				x="0"
				y="0"
				width="152"
				height="152"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dx="-4" dy="4" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25_514" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25_514" result="shape" />
			</filter>
		</defs>
	</svg>
);

export default Skip;
