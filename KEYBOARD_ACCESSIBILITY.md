# 🎮 Système d'Accessibilité Clavier - PokeBattle Tower

## Vue d'ensemble

Le système d'accessibilité clavier permet de jouer entièrement au clavier pendant les combats, offrant une alternative rapide et efficace à la souris.

## ✨ Fonctionnalités

### Navigation Clavier Complète
- ✅ **BattleMenu** - Menu principal de combat (FIGHT/SKILLS/BAG/RUN)
- ✅ **MoveSelector** - Sélection des attaques Pokémon
- ✅ **TargetSelector** - Sélection des cibles ennemies/alliées
- ✅ **SkillSelector** - Compétences du dresseur

### Indicateurs Visuels
- **Focus Ring Animé** - Contour lumineux autour de l'élément sélectionné au clavier
- **Numéros de Touches** - Badge affichant le numéro (1-4) sur chaque option
- **Aide Contextuelle** - Overlay d'aide accessible avec `?`

## 🎯 Raccourcis Clavier

### Menu de Combat Principal (BattleMenu)

| Touche | Action |
|--------|--------|
| `1` ou `F` | FIGHT - Utiliser une attaque |
| `2` ou `S` | SKILLS - Compétence du dresseur |
| `3` ou `B` | BAG - Utiliser un objet |
| `4` ou `R` | RUN - Fuir le combat |
| `↑↓←→` | Naviguer dans le menu |
| `Enter` | Confirmer la sélection |
| `Esc` | Annuler / Retour |

### Sélection d'Attaque (MoveSelector)

| Touche | Action |
|--------|--------|
| `1-4` | Sélectionner l'attaque directement |
| `↑↓←→` | Naviguer entre les attaques |
| `Enter` | Utiliser l'attaque sélectionnée |
| `Esc` | Retour au menu principal |

### Sélection de Cible (TargetSelector)

| Touche | Action |
|--------|--------|
| `1-9` | Sélectionner une cible directement |
| `↑↓` | Naviguer entre les cibles |
| `Enter` | Confirmer la cible |
| `Esc` | Retour à la sélection d'attaque |

### Compétences du Dresseur (SkillSelector)

| Touche | Action |
|--------|--------|
| `1-9` | Utiliser une compétence directement |
| `↑↓` | Naviguer entre les compétences |
| `Enter` | Utiliser la compétence sélectionnée |
| `Esc` | Retour au menu principal |

### Raccourcis Universels

| Touche | Action |
|--------|--------|
| `?` | Afficher/Masquer l'aide des touches |
| `Esc` | Annuler / Retour au menu précédent |
| `Enter` ou `Space` | Confirmer la sélection |
| `↑↓←→` | Navigation (adaptée au contexte) |

## 🛠️ Architecture Technique

### Structure des Fichiers

```
client/src/
├── hooks/
│   └── useKeyboardNavigation.js     # Hook principal de navigation
├── utils/
│   └── keybindConfig.js             # Configuration des keybinds
├── components/
│   └── keyboard/
│       ├── FocusIndicator.jsx       # Indicateur visuel de focus
│       └── KeybindHint.jsx          # Overlay d'aide
```

### Hook `useKeyboardNavigation`

Le hook principal qui gère toute la logique de navigation clavier.

**Paramètres:**
```javascript
useKeyboardNavigation({
  items,              // Liste des éléments sélectionnables
  enabled,            // Active/désactive la navigation
  layout,             // 'grid' ou 'list'
  columns,            // Nombre de colonnes (pour grid)
  onSelect,           // Callback de sélection (Enter/Space)
  onCancel,           // Callback d'annulation (Escape)
  onChange,           // Callback de changement de focus
  enableNumberKeys,   // Active touches 1-9
  customKeys,         // Touches personnalisées {key: index}
  isItemDisabled,     // Fonction pour désactiver certains items
  loop,               // Boucler du dernier au premier
})
```

**Retour:**
```javascript
{
  selectedIndex,      // Index actuel
  selectedItem,       // Item actuellement sélectionné
  isKeyboardFocused,  // true si la navigation est au clavier
  getItemProps,       // Props à appliquer sur chaque item
  navigate,           // Fonction de navigation manuelle
  confirm,            // Fonction de confirmation
  cancel,             // Fonction d'annulation
}
```

### Composant `FocusIndicator`

Affiche un ring animé autour de l'élément focusé au clavier.

**Props:**
```javascript
<FocusIndicator
  isVisible={true}     // Afficher ou non
  color="blue"         // Couleur (blue, yellow, green, red, purple)
  thickness={2}        // Épaisseur du ring
  animated={true}      // Animation de pulsation
>
  {children}
</FocusIndicator>
```

### Composant `KeybindHint`

Overlay d'aide contextuelle activé avec `?`.

**Props:**
```javascript
<KeybindHint
  context="battleMenu"  // Contexte (battleMenu, moveSelector, etc.)
  enabled={true}        // Activer l'aide
/>
```

## 🔧 Configuration

### Activer/Désactiver la Navigation Clavier

```javascript
import { keybindManager } from './utils/keybindConfig';

// Désactiver
keybindManager.setEnabled(false);

// Activer
keybindManager.setEnabled(true);

// Vérifier l'état
const isEnabled = keybindManager.isEnabled();
```

### Personnaliser les Touches du Menu de Combat

```javascript
import { keybindManager, BATTLE_MENU_KEYS } from './utils/keybindConfig';

// Récupérer les touches actuelles
const keys = keybindManager.getBattleMenuKeys();

// Les touches sont stockées dans localStorage sous 'pokebattle_keybinds'
```

## 💡 Exemples d'Utilisation

### Adapter un Nouveau Composant

```javascript
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';
import { keybindManager, getGridNumber } from '../utils/keybindConfig';
import FocusIndicator from './keyboard/FocusIndicator';

function MySelector({ items, onSelect, disabled }) {
  // Configuration de la navigation
  const {
    selectedIndex,
    isKeyboardFocused,
    getItemProps,
  } = useKeyboardNavigation({
    items,
    enabled: !disabled && keybindManager.isEnabled(),
    layout: 'grid',
    columns: 2,
    onSelect: (item, index) => {
      onSelect(item);
    },
    enableNumberKeys: true,
    loop: true,
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, index) => {
        const isSelected = index === selectedIndex && isKeyboardFocused;
        const keyNumber = getGridNumber(index);

        return (
          <FocusIndicator key={item.id} isVisible={isSelected} color="blue">
            <button
              {...getItemProps(index)}
              onClick={() => onSelect(item)}
              className="p-4 border rounded"
            >
              <div className="absolute top-1 left-1 text-xs opacity-50">
                {keyNumber}
              </div>
              {item.name}
            </button>
          </FocusIndicator>
        );
      })}
    </div>
  );
}
```

## 🎨 Personnalisation des Styles

### Couleurs des Focus Indicators

Les couleurs disponibles dans `FocusIndicator`:
- `blue` - Pour les menus généraux (par défaut)
- `yellow` - Pour les attaques et cibles
- `green` - Pour les confirmations
- `red` - Pour les dangers/annulations
- `purple` - Pour les compétences spéciales

### Modifier les Couleurs

Éditez `client/src/components/keyboard/FocusIndicator.jsx`:

```javascript
const colorClasses = {
  blue: 'ring-blue-400 shadow-blue-400/50',
  yellow: 'ring-yellow-400 shadow-yellow-400/50',
  // Ajoutez vos couleurs personnalisées ici
  custom: 'ring-pink-400 shadow-pink-400/50',
};
```

## 🔄 Améliorations Récentes

### ✨ Touches Numériques Sans MAJ
Les touches numériques **1-9** fonctionnent maintenant **sans tenir MAJ** ! Le système détecte automatiquement :
- Les touches `Digit1-9` du pavé principal (rangée du haut)
- Les touches `Numpad1-9` du pavé numérique

Plus besoin de se battre avec les symboles !/"/etc 🎉

### ✨ Pas de Conflit Souris/Clavier
Le système ne réagit plus au survol de la souris (`onMouseEnter`), seulement au **clic**.

**Avant :**
- Hover avec la souris → réinitialise constamment les animations
- Impossible de mixer clavier et souris

**Maintenant :**
- Le hover n'affecte pas la sélection clavier
- Les animations (PP bars, etc.) ne reboot plus
- Parfaite coexistence clavier/souris

## 🐛 Dépannage

### La Navigation ne Fonctionne Pas

1. Vérifiez que le système est activé:
   ```javascript
   console.log(keybindManager.isEnabled()); // Doit être true
   ```

2. Vérifiez que le composant passe `enabled={true}` au hook:
   ```javascript
   useKeyboardNavigation({
     items,
     enabled: true, // ← Vérifier ici
   });
   ```

3. Vérifiez qu'il n'y a pas de conflits avec d'autres listeners:
   - Le hook utilise `window.addEventListener('keydown')`
   - Les événements sont stoppés avec `event.stopPropagation()`

### Les Touches Numériques ne Fonctionnent Pas

Assurez-vous que `enableNumberKeys: true` est passé au hook:

```javascript
useKeyboardNavigation({
  items,
  enableNumberKeys: true, // ← Activer ici
});
```

### Le Focus Visuel ne S'affiche Pas

Vérifiez que:
1. `isKeyboardFocused` est bien utilisé dans la condition `isVisible`
2. Le composant `FocusIndicator` entoure bien l'élément

```javascript
<FocusIndicator isVisible={index === selectedIndex && isKeyboardFocused}>
  {/* Votre élément */}
</FocusIndicator>
```

## 🚀 Fonctionnalités Futures

### Prochaines Améliorations Possibles

- [ ] **Configuration Complète des Touches** - Interface UI pour rebinder toutes les touches
- [ ] **Feedback Audio** - Sons de navigation et de sélection
- [ ] **Profils de Keybinds** - Plusieurs profils (QWERTY, AZERTY, Gaming, etc.)
- [ ] **Navigation dans les Menus Hors Combat** - Étendre à l'inventaire, événements, etc.
- [ ] **Support Gamepad** - Ajouter le support manette
- [ ] **Raccourcis Avancés** - Combos de touches pour actions rapides
- [ ] **Mode Speedrun** - Keybinds optimisés pour le speedrun

## 📝 Notes de Développement

### Bonnes Pratiques

1. **Toujours désactiver les items invalides** avec `isItemDisabled`
2. **Utiliser `getItemProps(index)`** pour gérer les événements souris
3. **Passer `onCancel`** pour permettre le retour avec Escape
4. **Utiliser `loop: true`** pour une navigation circulaire
5. **Afficher les numéros de touches** pour guider l'utilisateur

### Performance

Le hook est optimisé pour:
- **Un seul listener global** par instance
- **Nettoyage automatique** avec `useEffect` cleanup
- **Batch updates** avec React state
- **Pas de re-renders inutiles** grâce à `useCallback`

## 📄 Licence

Ce système d'accessibilité fait partie du projet PokeBattle Tower.
