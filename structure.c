#include <stdio.h>
#include <string.h>
struct faah   //here faah is tag
{
    int i;
    char c[20];  //coz we are using sting with max range of 20 words
};
int main ()
{
    struct faah s1 = { 67,"faaaah"};
    struct faah s2 = {45,"oh yees"};

    printf("structure = %d\n",s1.i);
    printf("character value = %s\n",s1.c);
    printf("structure = %d\n",s2.i);
    printf("character value = %s\n",s2.c);
}