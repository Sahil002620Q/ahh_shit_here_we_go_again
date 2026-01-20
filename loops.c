#include <stdio.h>
int main () {
    int numbers[4] = {21,43,65,87};
    int *p = numbers;
        for(int i = 0 ; i < 4 ; i++ ){
            printf("%d\n",*p);
            p++;

        }
        return 0;
}

//Looping with Pointers