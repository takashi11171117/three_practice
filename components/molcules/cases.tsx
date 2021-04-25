import React, { FC } from 'react'
import CasesNext from 'assets/svg/arrow-right.svg'
import CasesPrev from 'assets/svg/arrow-left.svg'

const caseStudies = [
  {
    id: 1,
    subtitle: 'Design',
    title: 'Creating unique various design',
    img: 'design',
  },
  {
    id: 2,
    subtitle: 'Animation',
    title: 'Original motion graphics for your needs',
    img: 'animation',
  },
  {
    id: 3,
    subtitle: 'Illustration',
    title: 'Caricature',
    img: 'illustration',
  },
]

const Cases: FC = () => {
  return (
    <section className="cases">
      <div className="container-fluid">
        <div className="cases-navigation">
          <div className="cases-arrow prev disabled">
            <CasesPrev />
          </div>
          <div className="cases-arrow next">
            <CasesNext />
          </div>
        </div>
        <div className="row">
          {caseStudies.map((caseItem) => {
            return (
              <div className="case" key={caseItem.id}>
                <div className="case-details">
                  <span>{caseItem.subtitle}</span>
                  <h2>{caseItem.title}</h2>
                </div>
                <div className="case-image">
                  <img
                    src={require(`assets/${caseItem.img}.jpg`)}
                    alt={caseItem.title}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Cases
