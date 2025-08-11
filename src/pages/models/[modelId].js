import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/HouseModel.module.css';

// This would be replaced with a real API call or database query in production
const HOUSE_DATA = {
  walnut: {
    id: 'walnut',
    title: 'Walnut ADU',
    shortDescription: 'Modern Accessory Dwelling Unit',
    imageUrl: '/Walnut/walnut-hero.jpg',
    specifications: [
      { label: 'Bedrooms', value: '2' },
      { label: 'Bathrooms', value: '1' },
      { label: 'Square Footage', value: '800 sq ft' },
      { label: 'Stories', value: '1' },
      { label: 'Foundation', value: 'Concrete Slab' },
      { label: 'Exterior Finish', value: 'Fiber Cement Siding' },
      { label: 'Roofing', value: 'Composition Shingle' },
      { label: 'Heating', value: 'Electric Forced Air' },
      { label: 'Cooling', value: 'Mini-Split System' },
      { label: 'Estimated Price', value: 'Contact for Pricing' },
    ]
  },
  // Add more models here as needed
};

export default function HouseModel({ houseData }) {
  if (!houseData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{houseData.title} | RG Pro Builders</title>
        <meta name="description" content={`${houseData.title} - ${houseData.shortDescription}`} />
      </Head>

      <main className={styles.main}>
        {/* Hero Section with House Image */}
        <div className={styles.hero}>
          <Image
            src={houseData.imageUrl}
            alt={houseData.title}
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className={styles.heroOverlay}>
            <h1>{houseData.title}</h1>
            <p>{houseData.shortDescription}</p>
          </div>
        </div>

        {/* Specifications Table */}
        <section className={styles.specs}>
          <h2>Specifications</h2>
          <table className={styles.specsTable}>
            <tbody>
              {houseData.specifications.map((spec, index) => (
                <tr key={index}>
                  <th>{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const houseData = HOUSE_DATA[params.modelId] || null;
  
  if (!houseData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      houseData,
    },
  };
}

export async function getStaticPaths() {
  // Get the paths we want to pre-render based on HOUSE_DATA
  const paths = Object.keys(HOUSE_DATA).map((modelId) => ({
    params: { modelId },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}
