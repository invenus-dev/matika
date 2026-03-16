interface FeedbackEmojiProps {
  type: 'correct' | 'incorrect'
}

const sparkles = ['🎉', '🥳', '❤️', '🎊', '💪', '👏']

export function FeedbackEmoji({ type }: FeedbackEmojiProps) {
  if (type === 'correct') {
    return (
      <div className="relative flex items-center justify-center w-64 h-64">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="absolute text-4xl animate-sparkle"
            style={{
              animationDelay: `${i * 0.08}s`,
              '--angle': `${i * 60}deg`,
            } as React.CSSProperties}
          >
            {s}
          </span>
        ))}
        <span className="text-[10rem] leading-none animate-celebrate select-none">
          😄
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-64 h-64">
      <span className="text-[10rem] leading-none animate-sadface select-none">
        😕
      </span>
    </div>
  )
}
