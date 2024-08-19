import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BinomialProductDouble {
    
    // Método para multiplicar dos polinomios
    public static List<Double> multiplyPolynomials(List<Double> poly1, List<Double> poly2) {
        int degree1 = poly1.size();
        int degree2 = poly2.size();
        Double[] result = new Double[degree1 + degree2 - 1];
        Arrays.fill(result, 0.0);
        
        for (int i = 0; i < degree1; i++) {
            for (int j = 0; j < degree2; j++) {
                result[i + j] += poly1.get(i) * poly2.get(j);
            }
        }
        
        return Arrays.asList(result);
    }
    
    // Método para calcular el producto de n binomios (x - xi)
    public static List<Double> calculateBinomialProduct(double[] roots) {
        List<Double> poly = new ArrayList<>(Arrays.asList(1.0, -roots[0]));
        
        for (int i = 1; i < roots.length; i++) {
            List<Double> binomial = new ArrayList<>(Arrays.asList(1.0, -roots[i]));
            poly = multiplyPolynomials(poly, binomial);
        }
        
        return poly;
    }
    
    public static void main(String[] args) {
        // Lista de valores xi
        double[] roots = {1.0,0};
        
        // Calcular el producto de los binomios (x - xi)
        List<Double> polynomial = calculateBinomialProduct(roots);
        
        // Imprimir el polinomio resultante
        System.out.print("P(x) = ");
        for (int i = 0; i < polynomial.size(); i++) {
            if (i > 0 && polynomial.get(i) >= 0) {
                System.out.print("+");
            }
            System.out.print(polynomial.get(i));
            if (i < polynomial.size() - 1) {
                System.out.print("x^" + (polynomial.size() - 1 - i) + " ");
            }
        }
        int n = polynomial.size();
        System.out.println("\nMuestra de los coef: ");
        for(int i=0; i<n ;i++) {
        	if(i<n-1) {
        		System.out.print(polynomial.get(i)+",");
        	}else System.out.print(polynomial.get(i));
        }

    }
}
