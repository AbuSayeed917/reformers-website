import { publicPath } from "@/config/deployment";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { TextLink } from "@/components/site/text-link";
import { EnquiryLink } from "@/components/site/enquiry-link";
import { sectionIds } from "@/config/site";
import { demoProducts, type DemoProduct } from "@/content/products";
import styles from "./products.module.css";

function ProductExhibit({
  product,
  index,
}: {
  product: DemoProduct;
  index: number;
}) {
  return (
    <article
      className={styles.exhibit}
      data-tone={product.tone}
      data-branded={Boolean(product.logo)}
      aria-labelledby={`${product.id}-title`}
    >
      <div className={styles.artwork} aria-hidden="true">
        <span className={styles.catalogue}>
          DEMO / {String(index + 1).padStart(2, "0")}
        </span>
        {product.logo ? (
          <Image
            className={styles.productLogo}
            src={publicPath(product.logo)}
            alt=""
            width={1024}
            height={1024}
            unoptimized
          />
        ) : (
          <span className={styles.monogram}>{product.monogram}</span>
        )}
        <span className={styles.registration}>+</span>
        <span className={styles.artCaption}>AN IDEA, TAKING FORM.</span>
      </div>
      <div className={styles.caption}>
        <div>
          <p className={styles.category}>
            {product.category ?? "DEMO PRODUCT"}
          </p>
          <h3 id={`${product.id}-title`} data-name-style={product.nameStyle}>
            {product.nameStyle === "arcade" ? (
              <>
                <span>Bottle</span>
                <span>Raid</span>
              </>
            ) : (
              product.name
            )}
          </h3>
          {product.nameStyle === "arcade" && (
            <p className={styles.brandSubtitle}>Corsair Cove</p>
          )}
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}
        </div>
        {product.demoUrl ? (
          <TextLink
            href={product.demoUrl}
            aria-label={`View ${product.name} demo`}
          >
            View demo <span aria-hidden="true">↗</span>
          </TextLink>
        ) : (
          <EnquiryLink
            variant="text"
            subject={`Demo enquiry: ${product.name}`}
            aria-label={`Request a ${product.name} demo`}
          >
            Request a demo <span aria-hidden="true">↗</span>
          </EnquiryLink>
        )}
      </div>
    </article>
  );
}

export function Products() {
  return (
    <Container
      as="section"
      id={sectionIds.products}
      className={styles.products}
      aria-labelledby="products-heading"
    >
      <div className={styles.heading}>
        <SectionLabel>03 — IDEAS IN THE MAKING</SectionLabel>
        <h2 id="products-heading">
          From possibility.
          <br />
          <em>To product.</em>
        </h2>
        <p>
          Meet our demo products.
          <br />
          Small ideas. Working possibilities.
        </p>
      </div>
      <div className={styles.collection}>
        {demoProducts.map((product, index) => (
          <ProductExhibit key={product.id} product={product} index={index} />
        ))}
      </div>
    </Container>
  );
}
