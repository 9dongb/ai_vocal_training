import numpy as np
import tensorflow as tf

def tone_classification():

    labels = ['뭐', '뭐뭐','뭐', '뭐']

    model = tf.keras.models.load('models/tone_classification.h5')

    x_test = np.array([0, 0])
    y_predict = model.predict(x_test)


    label = labels[y_predict[0].argmax()]
    confidence = y_predict(x_test)

    return label, confidence


