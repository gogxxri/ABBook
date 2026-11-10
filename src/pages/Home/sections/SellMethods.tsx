import { ArrowUpRight, Bike, Package, Store, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styled from 'styled-components';

import Chip from '../../../components/common/Chip';
import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { SELL_METHODS } from '../../../constants/home';
import type { SellMethodKey } from '../../../types/db';

const METHOD_ICON: Record<SellMethodKey, LucideIcon> = {
  visit: Truck,
  parcel: Package,
  store: Store,
  quick: Bike,
};

export default function SellMethods() {
  return (
    <Section id="methods" $tone="white">
      <Container>
        <SectionHeader eyebrow="HOW TO SELL" title="나에게 맞는 매입 방법" description="수량과 위치에 맞춰 가장 편한 방법을 고르세요." />
        <Grid>
          {SELL_METHODS.map((method) => {
            const Icon = METHOD_ICON[method.key];
            return (
              <li key={method.key}>
                <a href="#quote">
                  <div className="head">
                    <span className="icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    {method.badge && <Chip $tone="primary">{method.badge}</Chip>}
                  </div>
                  <h3>
                    {method.title}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </h3>
                  <p>{method.description}</p>
                </a>
              </li>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
}

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  & a {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 28px 24px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.lg};
    background: ${({ theme }) => theme.colors.surface};
    transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  & a:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.card};
    transform: translateY(-2px);
  }

  & .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  & .icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }

  & h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & h3 > svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.subtle}; }

  & p {
    margin-top: 8px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 10px;

    & a { padding: 18px 16px; border-radius: ${({ theme }) => theme.radius.md}; }
    & .head { margin-bottom: 16px; }
    & .icon { width: 40px; height: 40px; }
    & h3 { font-size: 16px; }
    & p { font-size: 13px; }
  }

  ${({ theme }) => theme.media.small} {
    grid-template-columns: minmax(0, 1fr);
  }
`;
