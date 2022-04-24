# stanley gao
# 4/22/22

if __name__ == '__main__':

    # get words from source
    with open('words_alpha.txt') as f:
        words = set(f.read().split())
    
    # make dict of words, by length
    words_d = {}
    for word in words:
        length = len(word)
        if length not in words_d:
            words_d[length] = [word]
        else:
            words_d[length].append(word)

    # make separate files for length-n words
    """
    for length in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]:
        with open('words_{}.txt'.format(length), 'w+') as f:
            for word in words_d[length]:
                f.write(word + '\n')
    """
    
    # delete TypeScript file if exists
    import os
    if os.path.exists('words_data.ts'): os.remove('words_data.ts')
    
    # make TypeScript file with lists for length-n words
    with open('words_data.ts', 'a+') as f:
        for length in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]:
            f.write("export const allWords{} = [\n".format(length))
            for word in words_d[length]:
                f.write("\t'{}',\n".format(word))
            f.write("]\n")

    
