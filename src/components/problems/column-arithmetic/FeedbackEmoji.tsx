import {
  Confetti,
  Trophy,
  Heart,
  Star,
  ThumbsUp,
  HandsClapping,
  SmileyWink,
  SmileySad,
} from '@phosphor-icons/react'

interface FeedbackEmojiProps {
  type: 'correct' | 'incorrect'
}

const sparkles = [
  { Icon: Confetti, color: '#f59e0b' },
  { Icon: Trophy, color: '#eab308' },
  { Icon: Heart, color: '#ef4444' },
  { Icon: Star, color: '#f59e0b' },
  { Icon: ThumbsUp, color: '#3b82f6' },
  { Icon: HandsClapping, color: '#22c55e' },
]

export function FeedbackEmoji({ type }: FeedbackEmojiProps) {
  if (type === 'correct') {
    return (
      <div className="relative flex items-center justify-center w-64 h-64">
        {sparkles.map(({ Icon, color }, i) => (
          <span
            key={i}
            className="absolute animate-sparkle"
            style={{
              animationDelay: `${i * 0.08}s`,
              '--angle': `${i * 60}deg`,
            } as React.CSSProperties}
          >
            <Icon size={36} weight="fill" color={color} />
          </span>
        ))}
        <span className="animate-celebrate select-none emoji-solid" style={{ '--emoji-fill': '#86efac' } as React.CSSProperties}>
          <SmileyWink size={160} weight="duotone" color="#22c55e" />
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-64 h-64">
      <span className="animate-sadface select-none emoji-solid" style={{ '--emoji-fill': '#fca5a5' } as React.CSSProperties}>
        <SmileySad size={160} weight="duotone" color="#ef4444" />
      </span>
    </div>
  )
}
