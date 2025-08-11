import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/HouseModel.module.css';

export default function HouseModel({ houseData }) {
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

export async function getStaticProps(context) {
  // This would be replaced with actual data fetching in a real app
  const houseData = {
    id: 'walnut',
    title: 'Walnut ADU',
    shortDescription: 'Modern Accessory Dwelling Unit',
    imageUrl: '/images/walnut.jpg',
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
  };

  return {
    props: {
      houseData,
    },
  };
}
