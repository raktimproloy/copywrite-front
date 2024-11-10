import React from "react";
import styled from "styled-components";

import { CondLayout as Layout } from "@/layout";
import PricingCard from "@/components/BDPricingCard";
import Faq from "@/components/Faq";

const BDPricing = () => {
  return (
    <Layout>
      <div className="container">
        <Section>
          <PricingCard />
        </Section>
        <Section>
          <Faq />
        </Section>
      </div>
    </Layout>
  );
};

const Section = styled.div`
  margin: 85px 0;
`;

export default BDPricing;
