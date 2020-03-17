const baseUrl =
  'https://raw.githubusercontent.com/primavera133/dragonsGraphQLAPI/master/api/_data/families/'

const dataTree = {
  aeshnidae: {
    aeshna: [
      'aeshna-affinis',
      'aeshna-caerulea',
      'aeshna-crenata',
      'aeshna-cyanea',
      'aeshna-grandis',
      'aeshna-isoceles',
      'aeshna-juncea',
      'aeshna-mixta',
      'aeshna-serrata',
      'aeshna-subarctica',
      'aeshna-viridis'
    ],
    anax: [
      'anax-ephippiger',
      'anax-imaculifrons',
      'anax-imperator',
      'anax-junius',
      'anax-parthenope'
    ],
    boyeria: ['boyeria-cretensis', 'boyeria-irene'],
    brachytron: ['brachytron-pratense'],
    caliaeschna: ['caliaeschna-microstigma']
  },
  calopterygidae: {
    calopteryx: [
      'calopteryx-haemorrhoidalis',
      'calopteryx-splendens',
      'calopteryx-virgo',
      'calopteryx-xanthostoma'
    ]
  },
  coenagrionidae: {
    ceriagrion: ['ceriagrion-georgifreyi', 'ceriagrion-tenellum'],
    coenagrion: [
      'coenagrion-armatum',
      'coenagrion-caerulescens',
      'coenagrion-ecornutum',
      'coenagrion-glaciale',
      'coenagrion-hastulatum',
      'coenagrion-hylas',
      'coenagrion-intermedium',
      'coenagrion-johanssonii',
      'coenagrion-lunulatum',
      'coenagrion-mercuriale',
      'coenagrion-ornatum',
      'coenagrion-puella',
      'coenagrion-pulchellum',
      'coenagrion-scitulum'
    ],
    enallagma: ['enallagma-cyathigerum'],
    erythromma: [
      'erythromma-lindenii',
      'erythromma-najas',
      'erythromma-viridulum'
    ],
    ischnura: [
      'ischnura-aralensis',
      'ischnura-elegans',
      'ischnura-fountaineae',
      'ischnura-genei',
      'ischnura-graelsii',
      'ischnura-hastata',
      'ischnura-intermedia',
      'ischnura-saharensis',
      'ischnura-senegalensis'
    ],
    nehalennia: ['nehalennia-speciosa'],
    pyrrhosoma: ['pyrrhosoma-nymphula', 'pyrrhosoma-elisabethae']
  },
  cordulegastridae: {
    cordulegaster: [
      'cordulegaster-bidentata',
      'cordulegaster-boltonii',
      'cordulegaster-helladica',
      'cordulegaster-heros',
      'cordulegaster-insignis',
      'cordulegaster-picta',
      'cordulegaster-trinacriae'
    ]
  },
  corduliidae: {
    cordulia: ['cordulia-aenea'],
    epitheca: ['epitheca-bimaculata'],
    somatochlora: [
      'somatochlora-alpestris',
      'somatochlora-arctica',
      'somatochlora-borisi',
      'somatochlora-flavomaculata',
      'somatochlora-graeseri',
      'somatochlora-meridionalis',
      'somatochlora-metallica',
      'somatochlora-sahlbergi'
    ]
  },
  euphaeidae: { epallage: ['epallage-fatime'] },
  gomphidae: {
    lindenia: ['lindenia-tetraphylla'],
    gomphus: [
      'gomphus-flavipes',
      'gomphus-graslinii',
      'gomphus-pulchellus',
      'gomphus-schneiderii',
      'gomphus-simillimus',
      'gomphus-vulgatissimus'
    ],
    onychogomphus: [
      'onychogomphus-costae',
      'onychogomphus-forcipatus',
      'onychogomphus-uncatus'
    ],
    ophiogomphus: ['ophiogomphus-cecilia'],
    paragomphus: ['paragomphus-genei']
  },
  incertae_sedis: {
    oxygastra: ['oxygastra-curtisii']
  },
  lestidae: {
    chalcolestes: ['chalcolestes-parvidens', 'chalcolestes-viridis'],
    lestes: [
      'lestes-barbarus',
      'lestes-dryas',
      'lestes-macrostigma',
      'lestes-sponsa',
      'lestes-virens',
      'sympecma-fusca',
      'sympecma-paedisca'
    ]
  },
  libellulidae: {
    brachythemis: ['brachythemis-impartita'],
    crocothemis: ['crocothemis-erythraea'],
    diplacodes: ['diplacodes-lefebvrii'],
    leucorrhinia: [
      'leucorrhinia-albifrons',
      'leucorrhinia-caudalis',
      'leucorrhinia-dubia',
      'leucorrhinia-pectoralis',
      'leucorrhinia-rubicunda'
    ],
    libellula: [
      'libellula-depressa',
      'libellula-fulva',
      'libellula-quadrimaculata'
    ],
    orthetrum: [
      'orthetrum-albistylum',
      'orthetrum-brunneum',
      'orthetrum-cancellatum',
      'orthetrum-chrysostigma',
      'orthetrum-coerulescens',
      'orthetrum-nitidinerve',
      'orthetrum-sabina',
      'orthetrum-taeniolatum',
      'orthetrum-trinacria'
    ],
    pantala: ['pantala-flavescens'],
    selysiothemis: ['selysiothemis-nigra'],
    sympetrum: [
      'sympetrum-danae',
      'sympetrum-depressiculum',
      'sympetrum-flaveolum',
      'sympetrum-fonscolombii',
      'sympetrum-meridionale',
      'sympetrum-nigrifemur',
      'sympetrum-pedemontanum',
      'sympetrum-sanguineum',
      'sympetrum-sinaiticum',
      'sympetrum-striolatum',
      'sympetrum-vulgatum'
    ],
    trithemis: [
      'trithemis-annulata',
      'trithemis-arteriosa',
      'trithemis-festiva',
      'trithemis-kirbyi'
    ],
    zygonyx: ['zygonyx-torridus']
  },
  macromiidae: { macromia: ['macromia-amphigena', 'macromia-splendens'] },
  platycnemididae: {
    platycnemis: [
      'platycnemis-acutipennis',
      'platycnemis-dealbata',
      'platycnemis-latipes',
      'platycnemis-pennipes'
    ]
  }
}

export default {
  baseUrl,
  dataTree
}
