import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import InquiryBoard from './InquiryBoard';
import SalesReviews from './SalesReviews';

export default function BoardSection() {
  return (
    <Section>
      <Container>
        <SectionHeader eyebrow="COMMUNITY" title="실시간 문의와 매입 후기" />
        <Grid>
          <InquiryBoard />
          <SalesReviews />
        </Grid>
      </Container>
    </Section>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 20px;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 12px;
  }
`;
