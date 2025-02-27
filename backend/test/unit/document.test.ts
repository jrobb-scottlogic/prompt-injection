import { expect, jest, test } from '@jest/globals';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

import { getCommonDocuments, getLevelDocuments } from '@src/document';
import { LEVEL_NAMES } from '@src/models/level';

const mockLoader = jest.fn<() => Promise<Document[]>>();
const mockSplitDocuments = jest.fn<() => Promise<string[]>>();

// mock DirectoryLoader
jest.mock('langchain/document_loaders/fs/directory', () => {
	return {
		DirectoryLoader: jest.fn().mockImplementation(() => {
			return {
				load: mockLoader,
			};
		}),
	};
});

// mock RecursiveCharacterTextSplitter
jest.mock('langchain/text_splitter', () => {
	return {
		RecursiveCharacterTextSplitter: jest.fn().mockImplementation(() => {
			return {
				splitDocuments: mockSplitDocuments,
			};
		}),
	};
});

test('WHEN get documents for a level THEN returns the correct documents', async () => {
	const mockLevelSplitDocs = ['split1', 'split1.5', 'split2'];

	mockLoader.mockResolvedValue([]);
	mockSplitDocuments.mockResolvedValueOnce(mockLevelSplitDocs);

	const result = await getLevelDocuments(LEVEL_NAMES.LEVEL_1);

	expect(DirectoryLoader).toHaveBeenCalledWith(
		'resources/documents/level_1/',
		expect.any(Object)
	);
	expect(result.sort()).toEqual(mockLevelSplitDocs.sort());
});

test('WHEN get common documents THEN returns the correct documents', async () => {
	const mockLevelSplitDocs = ['commonDoc1', 'commonDoc2', 'commonDoc3'];

	mockLoader.mockResolvedValue([]);
	mockSplitDocuments.mockResolvedValueOnce(mockLevelSplitDocs);

	const result = await getCommonDocuments();

	expect(DirectoryLoader).toHaveBeenCalledWith(
		'resources/documents/common/',
		expect.any(Object)
	);
	expect(result.sort()).toEqual(mockLevelSplitDocs.sort());
});
