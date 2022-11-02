import * as path from 'path';
import moduleAlias, { addAliases } from 'module-alias';

// buscando o root do diretorio atual
const files = path.resolve(__dirname, '../..');

// adicionando ALIAS para os caminhos de src e test, para funcionarem a partir de @
moduleAlias.addAliases({
    '@src' : path.join(files, 'src'),
    '@test': path.join(files, 'test')
});