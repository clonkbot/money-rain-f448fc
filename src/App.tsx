import { useEffect, useState, useCallback, useMemo } from 'react';
import './styles.css';

interface MoneyItem {
  id: number;
  symbol: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  rotationSpeed: number;
  layer: number;
  type: 'symbol' | 'bill' | 'coin';
}

const MONEY_SYMBOLS = ['$', '€', '£', '¥', '₿', '💵', '💴', '💶', '💷', '🪙', '💰', '💎'];
const BILL_EMOJIS = ['💵', '💴', '💶', '💷'];
const COIN_EMOJIS = ['🪙', '💰', '💎', '🏆'];

function App() {
  const [moneyItems, setMoneyItems] = useState<MoneyItem[]>([]);
  const [flash, setFlash] = useState(false);

  const createMoneyItem = useCallback((id: number): MoneyItem => {
    const type = Math.random() > 0.6 ? 'symbol' : Math.random() > 0.5 ? 'bill' : 'coin';
    let symbol: string;

    if (type === 'symbol') {
      symbol = ['$', '€', '£', '¥', '₿'][Math.floor(Math.random() * 5)];
    } else if (type === 'bill') {
      symbol = BILL_EMOJIS[Math.floor(Math.random() * BILL_EMOJIS.length)];
    } else {
      symbol = COIN_EMOJIS[Math.floor(Math.random() * COIN_EMOJIS.length)];
    }

    return {
      id,
      symbol,
      x: Math.random() * 100,
      size: type === 'symbol' ? 20 + Math.random() * 60 : 30 + Math.random() * 50,
      duration: 2 + Math.random() * 6,
      delay: Math.random() * -10,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
      layer: Math.floor(Math.random() * 3),
      type,
    };
  }, []);

  const initialItems = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => createMoneyItem(i));
  }, [createMoneyItem]);

  useEffect(() => {
    setMoneyItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const flashInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }
    }, 500);

    return () => clearInterval(flashInterval);
  }, []);

  useEffect(() => {
    const addInterval = setInterval(() => {
      setMoneyItems(prev => {
        const newItems = [...prev];
        if (newItems.length < 120) {
          newItems.push(createMoneyItem(Date.now() + Math.random()));
        }
        return newItems;
      });
    }, 200);

    return () => clearInterval(addInterval);
  }, [createMoneyItem]);

  return (
    <div className={`app-container ${flash ? 'flash-active' : ''}`}>
      {/* Background layers */}
      <div className="bg-layer bg-gradient" />
      <div className="bg-layer bg-noise" />
      <div className="bg-layer bg-scanlines" />

      {/* Floating big money text */}
      <div className="money-text-container">
        <div className="money-text glitch" data-text="MONEY">MONEY</div>
        <div className="money-text-sub">RAIN</div>
      </div>

      {/* Money rain layers */}
      {[0, 1, 2].map(layer => (
        <div key={layer} className={`money-layer layer-${layer}`}>
          {moneyItems
            .filter(item => item.layer === layer)
            .map(item => (
              <div
                key={item.id}
                className={`money-item ${item.type}`}
                style={{
                  left: `${item.x}%`,
                  fontSize: `${item.size}px`,
                  animationDuration: `${item.duration}s`,
                  animationDelay: `${item.delay}s`,
                  '--rotation': `${item.rotation}deg`,
                  '--rotation-speed': `${item.rotationSpeed}deg`,
                } as React.CSSProperties}
              >
                {item.symbol}
              </div>
            ))}
        </div>
      ))}

      {/* Screen flash overlay */}
      <div className={`flash-overlay ${flash ? 'active' : ''}`} />

      {/* Corner decorations */}
      <div className="corner-deco top-left">$$$</div>
      <div className="corner-deco top-right">€€€</div>
      <div className="corner-deco bottom-left">£££</div>
      <div className="corner-deco bottom-right">¥¥¥</div>

      {/* Pulsing circles */}
      <div className="pulse-circle circle-1" />
      <div className="pulse-circle circle-2" />
      <div className="pulse-circle circle-3" />

      {/* Footer */}
      <footer className="site-footer">
        Requested by @s1s21s21 · Built by @clonkbot
      </footer>
    </div>
  );
}

export default App;
