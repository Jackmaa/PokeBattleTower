# Design System - UI Components

Modern gaming-themed UI components for PokeBattleTower 2.0

## Components

### Button
Animated button with multiple variants and sizes.

```jsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// Variants: 'primary' | 'secondary' | 'danger' | 'success'
// Sizes: 'sm' | 'md' | 'lg'
// Props: disabled, loading
```

### Card
Glassmorphism card with optional hover effects.

```jsx
import { Card } from '@/components/ui';

<Card hover clickable onClick={handleClick}>
  Card content
</Card>

// Variants: 'default' | 'glow'
```

### Modal
Full-featured modal dialog with glassmorphism backdrop.

```jsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>

// Sizes: 'sm' | 'md' | 'lg' | 'xl'
// Props: closeOnBackdrop, showCloseButton
```

### StatusIndicator
Battle status effect badges (poison, burn, paralysis, etc.).

```jsx
import { StatusIndicator, StatusBadgeGroup } from '@/components/ui';

<StatusIndicator status="poison" size="md" />

<StatusBadgeGroup statuses={['poison', 'burn']} />

// Status types: 'poison' | 'paralysis' | 'burn' | 'freeze' | 'sleep' | 'confused'
```

### Toast
Notification toast with auto-dismiss.

```jsx
import { Toast } from '@/components/ui';

<Toast
  isVisible={show}
  onClose={handleClose}
  message="Battle won!"
  type="success"
  duration={3000}
/>

// Types: 'success' | 'error' | 'warning' | 'info'
```

### DamagePopup
Animated damage numbers for battle.

```jsx
import { DamagePopup } from '@/components/ui';

<DamagePopup
  damage={42}
  isCritical={true}
  position={{ x: 100, y: 50 }}
/>
```

## Enhanced Components

### PokemonCard
Enhanced with Framer Motion animations, glassmorphism, and hover effects.

- Shake animation on damage
- Hover lift effect when clickable
- Fainted state (rotated sprite + grayscale)
- Active indicator badge
- Type-based border colors with glow

### HealthBar
Smooth animated health bar with color gradients.

- Green → Yellow → Red color transitions
- Gradient fill with shine effect
- Spring animation on HP changes
- Critical health warning indicator (pulsing !)
- Optional text display

## Theme Colors

Custom gaming colors available via Tailwind:

- `bg-gaming-dark` - #0f0f1e
- `bg-gaming-darker` - #0a0a14
- `bg-gaming-accent` - #6366f1
- `bg-gaming-accent-light` - #818cf8
- `bg-gaming-success` - #10b981
- `bg-gaming-danger` - #ef4444
- `bg-gaming-warning` - #f59e0b

### PageTransition
Smooth page transitions with multiple variants.

```jsx
import { PageTransition } from '@/components/ui';

<PageTransition variant="fade">
  <YourPage />
</PageTransition>

// Variants: 'fade' | 'slide' | 'scale'
```

### StaggerContainer
Animate lists with stagger effect.

```jsx
import { StaggerContainer, StaggerItem } from '@/components/ui';

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <ItemComponent />
    </StaggerItem>
  ))}
</StaggerContainer>
```

## Utility Classes

### Layout & Effects
- `.glass-card` - Glassmorphism effect
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.text-glow` - Text glow effect
- `.text-gradient` - Gradient text effect
- `.focus-ring` - Accessible focus indicator

### Micro-interactions
- `.hover-lift` - Lift on hover
- `.hover-glow` - Glow on hover
- `.animate-pulse-slow` - Slow pulse animation
- `.animate-bounce-subtle` - Subtle bounce animation
- `.animate-shake` - Shake animation
- `.animate-spin-slow` - Slow spin animation
- `.custom-scrollbar` - Styled scrollbar

## Animations

All components use Framer Motion for smooth, spring-based animations:
- Scale transforms on hover/tap
- Slide and fade transitions
- Spring physics for natural movement
- Stagger animations for lists
- Page transitions with AnimatePresence
- Exit animations for modals and overlays

## Phase 2.3 Completed Features

✅ **Reward System Fix**: Clear visual feedback when selecting Pokemon for heal/buff
✅ **Page Transitions**: Smooth transitions between Starter and Battle screens
✅ **Micro-interactions**: Hover, focus, and active states for all interactive elements
✅ **Stagger Animations**: Sequential animations for Pokemon card lists
✅ **Custom Utilities**: Extended utility classes for common patterns
