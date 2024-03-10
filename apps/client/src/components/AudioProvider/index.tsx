import { createContext, useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks';

const audioFiles = {
	gameChat: {
		messageReceived: 'sample.mp3',
	},
} as const;

type GameChatAudioType = keyof typeof audioFiles.gameChat;

type AudioContextType = {
	gameChat: (type: GameChatAudioType, forcePlay?: boolean) => void;
};

const AudioContext = createContext<AudioContextType>({
	gameChat: () => null,
});

const createAudio = () => (typeof Audio !== 'undefined' ? new Audio() : null);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
	const [audioEnabled] = useLocalStorage('audioEnabled', false);
	const [gameChatAudio] = useState(createAudio());

	const value: AudioContextType = useMemo(() => ({
		gameChat: (type, forcePlay) => {
			if (audioEnabled && gameChatAudio && (gameChatAudio.paused || forcePlay)) {
				gameChatAudio.src = `/audio/${audioFiles.gameChat[type]}`;
				gameChatAudio.play();
			}
		},
	}), [gameChatAudio, audioEnabled]);

	return (
		<AudioContext.Provider value={value}>
			{children}
		</AudioContext.Provider>
	);
};

export { AudioProvider, AudioContext };
