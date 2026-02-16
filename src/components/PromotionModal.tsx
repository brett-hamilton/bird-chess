import type { Color, PieceKind } from '../chess';
import { BIRD_NAMES } from '../chess';
import { getPieceImage } from '../assets/pieces';
import './PromotionModal.css';

interface PromotionModalProps {
  color: Color;
  onSelect: (kind: PieceKind) => void;
}

const PROMOTION_CHOICES: PieceKind[] = ['queen', 'rook', 'bishop', 'knight'];

export default function PromotionModal({ color, onSelect }: PromotionModalProps) {
  return (
    <div className="promotion-modal__overlay">
      <div className="promotion-modal">
        <h3 className="promotion-modal__title">Promote your Starling!</h3>
        <div className="promotion-modal__choices">
          {PROMOTION_CHOICES.map(kind => (
            <button
              key={kind}
              className="promotion-modal__choice"
              onClick={() => onSelect(kind)}
              title={BIRD_NAMES[kind]}
            >
              <img
                className="promotion-modal__img"
                src={getPieceImage(color, kind)}
                alt={BIRD_NAMES[kind]}
              />
              <span className="promotion-modal__label">{BIRD_NAMES[kind]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
